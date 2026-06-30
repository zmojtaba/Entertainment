using EntertainmentApp.Application.Common.Dtos;
using EntertainmentApp.Application.Interfaces.Account;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.JsonWebTokens; // Modern library
using System.Security.Claims;
using System.Text;

// 1. Resolve ambiguity: Tell the compiler to use the modern version for these names
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace EntertainmentApp.Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly IConfiguration _config;
        private readonly IAccountRepository _userRepo;

        // 2. Fix "_handler does not exist": Declare it at the class level
        private readonly JsonWebTokenHandler _handler = new JsonWebTokenHandler();

        public TokenService(IConfiguration config, IAccountRepository userRepository)
        {
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
            _userRepo = userRepository;
        }

        public string CreateAccessToken(ApplicationUser appUser, string role)
        {
            if (string.IsNullOrWhiteSpace(role)) throw new Exception("Role is required");

            // Modern handler works best with a dictionary of claims
            var claims = new Dictionary<string, object>
            {
                [JwtRegisteredClaimNames.Sub] = appUser.UserName,
                [JwtRegisteredClaimNames.UniqueName] = appUser.UserName,
                [ClaimTypes.Role] = role,
                ["token_type"] = "access_token"
            };

            var descriptor = new SecurityTokenDescriptor
            {
                Claims = claims,
                Expires = DateTime.UtcNow.AddHours(12),
                SigningCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature),
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"]
            };

            return _handler.CreateToken(descriptor);
        }

        public string CreateRefreshToken(ApplicationUser appUser)
        {
            var claims = new Dictionary<string, object>
            {
                [JwtRegisteredClaimNames.UniqueName] = appUser.UserName,
                ["token_type"] = "refresh_token",
            };

            var descriptor = new SecurityTokenDescriptor
            {
                Claims = claims,
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature),
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"]
            };

            string token = _handler.CreateToken(descriptor);
            appUser.RefreshToken = token;
            return token;
        }

        public ClaimsPrincipal ValidateRefreshToken(string token)
        {
            var parameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _key,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false, // Handled manually in GetUserByToken
            };

            var result = _handler.ValidateToken(token, parameters);
            if (!result.IsValid) throw new Exception("Invalid refresh token");

            // 3. Use ClaimsIdentity property to create the Principal
            return new ClaimsPrincipal(result.ClaimsIdentity);
        }

        public ClaimsPrincipal ValidateToken(string token)
        {
            var parameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _config["JWT:Issuer"],
                ValidAudience = _config["JWT:Audience"],
                IssuerSigningKey = _key,
                ClockSkew = TimeSpan.Zero
            };

            var result = _handler.ValidateToken(token, parameters);
            if (!result.IsValid) throw new Exception("Invalid access token");

            return new ClaimsPrincipal(result.ClaimsIdentity);
        }

        public async Task<UserInfoByTokenDto> GetUserByToken(string token)
        {
            var parameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _key,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false
            };

            var result = _handler.ValidateToken(token, parameters);

            if (!result.IsValid)
                throw new Exception("Token is invalid: " + result.Exception?.Message);

            // Access the JsonWebToken object specifically to get expiration
            var jwt = result.SecurityToken as JsonWebToken;

            if (jwt == null || jwt.ValidTo < DateTime.UtcNow)
                throw new Exception("Token has expired");

            return new UserInfoByTokenDto
            {
                // Access claims through the identity
                UserName = result.ClaimsIdentity.FindFirst(JwtRegisteredClaimNames.UniqueName)?.Value,
                Role = result.ClaimsIdentity.FindFirst(ClaimTypes.Role)?.Value
                       ?? result.ClaimsIdentity.FindFirst("role")?.Value
            };
        }

        public bool IsTokenExpired(string token)
        {
            var jwt = _handler.ReadJsonWebToken(token);
            return jwt.ValidTo < DateTime.UtcNow;
        }
    }
}