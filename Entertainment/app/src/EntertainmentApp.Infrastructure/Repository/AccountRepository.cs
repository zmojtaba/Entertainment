using EntertainmentApp.Application.Interfaces.Account;
using Microsoft.AspNetCore.Identity;
using NAudio.CoreAudioApi;

namespace EntertainmentApp.Infrastructure.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDBContext _context;

        public AccountRepository(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ApplicationDBContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        public async Task<List<ApplicationUser>> GetAllUserAsync()
        {
            return await _userManager.Users.ToListAsync();
        }

        public async Task<IdentityResult> CreateAccountAsync(ApplicationUser user, string password)
            => await _userManager.CreateAsync(user, password);

        public async Task<IdentityResult> AddToRoleAsync(ApplicationUser user, string role)
            => await _userManager.AddToRoleAsync(user, role);

        public async Task<ApplicationUser> GetAccountByUsernameAsync(string userName)
        {
            return await _userManager.FindByNameAsync(userName);
            
        }
        public async Task<IdentityResult> DeleteAsync(ApplicationUser user)
        {
            return await _userManager.DeleteAsync(user);
        }

        public async Task<IdentityResult> UpdateUserAsync(ApplicationUser user)
        {
            return await _userManager.UpdateAsync(user);
        }

        public async Task DeleteAccountAsync(ApplicationUser user)
        {
            await _userManager.DeleteAsync(user);
        }

        public async Task<string?> GetAccountRoleAsync(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            return roles.FirstOrDefault();
        }

        public async Task<bool> CheckPasswordAsync(ApplicationUser user, string password)
        {
            return await _userManager.CheckPasswordAsync(user, password);
        }

        public async Task<IdentityResult> ResetPasswordAsync(ApplicationUser user, string newPassword)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            return await _userManager.ResetPasswordAsync(user, token, newPassword);
        }

        public async Task AddUserHistory(UserLoginHistory userHistory)
        {
            await _context.UserLoginHistories.AddAsync(userHistory);
            await _context.SaveChangesAsync();
            await Task.CompletedTask;
        }

        public async Task<List<UserLoginHistory>> GetUserLoginHistories(string username)
        {
            return await Task.FromResult(_context.UserLoginHistories
                .Where(u => u.Username.ToLower() == username.ToLower())
                .OrderByDescending(u => u.LoginTime)
                .ToList());
        }

        public async Task<List<UserLoginHistory>> GetAllUserLoginHistories()
        {
            return await Task.FromResult(_context.UserLoginHistories
                .OrderByDescending(u => u.LoginTime)
                .ToList());
        }

    }
}
