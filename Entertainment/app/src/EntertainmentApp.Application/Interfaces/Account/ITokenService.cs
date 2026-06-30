using EntertainmentApp.Domain.Entities.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Application.Interfaces.Account
{
    public interface ITokenService
    {
        string CreateAccessToken(ApplicationUser appUser, string role);
        string CreateRefreshToken(ApplicationUser appUser);
        Task<UserInfoByTokenDto> GetUserByToken(string accessToken);
        bool IsTokenExpired(string token);
    }
}
