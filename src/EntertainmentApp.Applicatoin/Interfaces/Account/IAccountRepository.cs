using EntertainmentApp.Domain.Entities.Account;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EntertainmentApp.Applicatoin.Interfaces.Account
{
    public interface IAccountRepository
    {
        public Task<ApplicationUser> GetAccountByUsernameAsync(string userName);
        public Task<IdentityResult> CreateAccountAsync(ApplicationUser user, string passwork);
        public Task<IdentityResult> AddToRoleAsync(ApplicationUser user, string role);
        public  Task<IdentityResult> DeleteAsync(ApplicationUser user);
        public Task<IdentityResult> UpdateUserAsync(ApplicationUser user);
        public Task<string?> GetAccountRoleAsync(ApplicationUser user);
        public Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
        public Task<IdentityResult> ResetPasswordAsync(ApplicationUser user, string newPassword);

        public  Task AddUserHistory(UserLoginHistory userHistory);
        public Task<List<UserLoginHistory>> GetUserLoginHistories(string username);

        public Task<List<UserLoginHistory>> GetAllUserLoginHistories();
    }
}
