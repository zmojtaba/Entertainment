using Microsoft.AspNetCore.Identity;

namespace EntertainmentApp.Domain.Entities.Account
{
    public class ApplicationUser : IdentityUser
    {
        public string? RefreshToken { get; set; }
    }
}
