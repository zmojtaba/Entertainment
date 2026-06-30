namespace Entertainment.Server.Applicatoin.Common.Dtos
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public string? AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
