using System.Text;
namespace Entertainment.Server.API.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IMediator _mediator;
        public AccountController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("accounts")]
        public async Task<IActionResult> GetAccountsAsync()
        {
            var result = await _mediator.Send(new GetAccountsQuery());
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("accounts/{username}")]
        public async Task<IActionResult> DeleteAccountAsync([FromRoute] string username)
        {
            var result = await _mediator.Send(new DeleteAccountCommand(username));
            return Ok("Deleted Successfully");
        }


        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> RegisterAccountAsync([FromBody] RegisterDto dto)
        {

            string? authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader == null) return BadRequest("Access Token is not valid");

            string? accessToken = authHeader.Substring("Bearer ".Length);

            RegisterAccountCommand command = new RegisterAccountCommand
            {
                UserName = dto.UserName,
                Password = dto.Password,
                ConfirmPassword = dto.ConfirmPassword,
                Role = dto.Role,
                AdminAccessToken = accessToken

            };
            var result = await _mediator.Send(command);
            return Ok(result);
        }


        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenDto dto)
        {
            
            UserDto user = await _mediator.Send(new RefreshTokenCommand(dto.Token));

            return Ok(user);

        }

        [HttpPost("log-in")]
        public async Task<IActionResult> LogIn([FromBody] LoginDto dto)
        {
            LogInCommand command = new LogInCommand(dto.UserName, dto.Password);

            var result = await _mediator.Send(command);
            return Ok(result);
        }


        [Authorize( Roles ="Admin" )]
        [HttpPost("change-pass")]
        public async Task<IActionResult> ResetPassword([FromBody] LoginDto dto)
        {
            string? authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader == null) return BadRequest("Access Token is not valid");

            string? accessToken = authHeader.Substring("Bearer ".Length);

            ResetPasswordCommand command = new ResetPasswordCommand
            {
                   Username = dto.UserName,
                   Password = dto.Password,
                   AdminAccessToken = accessToken
            };

            UserDto result = await _mediator.Send(command);
            return Ok(result);

        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users-log-in-history")]
        public async Task<IActionResult> GetUsersLogInHistory()
        {
            var histories = await _mediator.Send(new UsersLogInHistoryQuery());
            var sb = new StringBuilder();

            foreach (var item in histories)
            {
                sb.AppendLine($"Username     : {item.Username}");
                sb.AppendLine($"Login Time   : {DateTimeOffset.FromUnixTimeSeconds(item.LoginTime).ToLocalTime()}");
                sb.AppendLine($"IP Address   : {item.IpAddress}");
                sb.AppendLine($"User Agent   : {item.UserAgent}");
                sb.AppendLine($"Successful   : {item.IsSuccessful}");
                sb.AppendLine(new string('-', 50));
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());

            return File(
                bytes,
                "text/plain",
                $"LoginHistory_{DateTime.Now:yyyyMMddHHmmss}.txt");


        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users-log-in-history/{username}")]
        public async Task<IActionResult> GetUsersLogInHistoryById([FromRoute] string username)
        {
            var histories = await _mediator.Send(new UsersLogInHistoryByUserNameQuery(username));
            var sb = new StringBuilder();

            foreach (var item in histories)
            {
                sb.AppendLine($"Username     : {item.Username}");
                sb.AppendLine($"Login Time   : {DateTimeOffset.FromUnixTimeSeconds(item.LoginTime).ToLocalTime()}");
                sb.AppendLine($"IP Address   : {item.IpAddress}");
                sb.AppendLine($"User Agent   : {item.UserAgent}");
                sb.AppendLine($"Successful   : {item.IsSuccessful}");
                sb.AppendLine(new string('-', 50));
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());

            return File(
                bytes,
                "text/plain",
                $"LoginHistory_{DateTime.Now:yyyyMMddHHmmss}.txt");

            }


    }
}
