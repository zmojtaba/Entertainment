using System.ComponentModel.DataAnnotations;

namespace Entertainment.Server.API.Dtos
{
    public class RegisterDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        
        public string ConfirmPassword { get; set; }
        
        public string Role { get; set; }
    }
}
