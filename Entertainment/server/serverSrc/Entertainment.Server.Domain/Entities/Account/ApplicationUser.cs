
namespace Entertainment.Server.Domain.Entities.Account
{
    public class ApplicationUser : IdentityUser
    {
        public string? RefreshToken { get; set; }
    }
}
