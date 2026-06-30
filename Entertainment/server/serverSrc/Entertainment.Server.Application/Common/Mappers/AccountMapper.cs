using Entertainment.Server.Domain.Entities.Account;

namespace Entertainment.Server.Applicatoin.Common.Mappers
{
    public static class AccountMapper
    {
        public static UserDto ToUserDto(this ApplicationUser user, string? accessToken, string? role)
        {
            return new UserDto
            {
                Id = Guid.Parse(user.Id),
                Username = user.UserName,
                Role = role,
                RefreshToken = user.RefreshToken,
                AccessToken = accessToken
            };
        }
    }
}
