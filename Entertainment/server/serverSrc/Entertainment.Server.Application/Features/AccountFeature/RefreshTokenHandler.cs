
using Entertainment.Server.Applicatoin.Interfaces.Account;
using Entertainment.Server.Domain.Entities.Account;

namespace Entertainment.Server.Applicatoin.Features.AccountFeature
{
    public record RefreshTokenCommand(string RefreshToken) : ICommand<UserDto>;
    public class RefreshTokenHandler(IAccountRepository accountRepo, ITokenService tokenService)
            : ICommandHandler<RefreshTokenCommand, UserDto>
    {
        public async Task<UserDto> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(command.RefreshToken)) throw new BadRequestException("Refresh token is required");
            if (tokenService.IsTokenExpired(command.RefreshToken))
                throw new BadRequestException("token is expired");

            UserInfoByTokenDto userInfo = await tokenService.GetUserByToken(command.RefreshToken);
            if (userInfo == null) throw new BadRequestException("token is not valid");

            ApplicationUser? appUser = await accountRepo
                .GetAccountByUsernameAsync(userInfo.UserName.ToUpperInvariant());
            if (appUser == null) throw new BadRequestException("Token is not valid");

            var role = await accountRepo.GetAccountRoleAsync(appUser);

            if (!command.RefreshToken.Equals(appUser.RefreshToken, StringComparison.OrdinalIgnoreCase))
                throw new BadRequestException("token is not for this username");
            string refreshToken = tokenService.CreateRefreshToken(appUser);
            string accessToken = tokenService.CreateAccessToken(appUser, role);
            appUser.RefreshToken = refreshToken;

            await accountRepo.UpdateUserAsync(appUser);


            return appUser.ToUserDto(accessToken, role);

        }
        
    }
}
