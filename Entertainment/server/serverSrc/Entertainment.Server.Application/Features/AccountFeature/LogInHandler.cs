namespace Entertainment.Server.Applicatoin.Features.AccountFeature
{
    public record LogInCommand(string UserName, string Password) : ICommand<UserDto>;
    public class LogInHandler(

            IAccountRepository accountRepo,
            ITokenService tokenService,
            IHttpContextAccessor _httpContextAccessor) : ICommandHandler<LogInCommand, UserDto>
    {

        public async Task<UserDto> Handle(LogInCommand command, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(command.UserName) || string.IsNullOrEmpty(command.Password))
            {
                throw new BadRequestException("Username and password must be provided.");
            }



            ApplicationUser appUser = await accountRepo.GetAccountByUsernameAsync(command.UserName);
            if (appUser == null)
            {
                throw new NotFoundException("Username not found.");
            }

            bool isPasswordValid = await accountRepo.CheckPasswordAsync(appUser, command.Password);

            UserLoginHistory userHistory = new UserLoginHistory
            {
                Username= command.UserName,
                LoginTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                IpAddress = _httpContextAccessor.HttpContext?
                    .Connection.RemoteIpAddress?.ToString(),
                UserAgent = _httpContextAccessor.HttpContext?
                    .Request.Headers["User-Agent"].ToString(),
                IsSuccessful = isPasswordValid
            };

            await accountRepo.AddUserHistory(userHistory);

            if (!isPasswordValid)
            {
                throw new BadRequestException("Password is incorrect.");
            }

            string role = await accountRepo.GetAccountRoleAsync(appUser);

            if (role == null) throw new BadRequestException("This username has no role");
            string accessToken = tokenService.CreateAccessToken(appUser, role);
            string refreshToken = tokenService.CreateRefreshToken(appUser);
            appUser.RefreshToken = refreshToken;
            await accountRepo.UpdateUserAsync(appUser);

            return appUser.ToUserDto(accessToken, role);
        }
        
    }
}
