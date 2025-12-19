using EntertainmentApp.API.Dtos;
using EntertainmentApp.Applicatoin.Common.Dtos;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static EntertainmentApp.Applicatoin.Features.AccountFeature.LogInHandler;
using static EntertainmentApp.Applicatoin.Features.AccountFeature.RefreshTokenHandler;
using static EntertainmentApp.Applicatoin.Features.AccountFeature.RegisterAccountHandler;
using static EntertainmentApp.Applicatoin.Features.AccountFeature.ResetPasswordHandler;
using static EntertainmentApp.Applicatoin.Features.AccountFeature.UsersLogInHistoryByUserNameHandler;
using static EntertainmentApp.Applicatoin.Features.AccountFeature.UsersLoginHistoryHandler;

namespace EntertainmentApp.API.Controllers
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


        [Authorize]
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


        [Authorize]
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

        [Authorize]
        [HttpGet("users-log-in-history")]
        public async Task<IActionResult> GetUsersLogInHistory()
        {
            var result = await _mediator.Send(new UsersLogInHistoryQuery());
            return Ok(result);
        }

        [Authorize]
        [HttpGet("users-log-in-history/{username}")]
        public async Task<IActionResult> GetUsersLogInHistory([FromRoute] string username)
        {
            var result = await _mediator.Send(new UsersLogInHistoryByUserNameQuery(username));
            return Ok(result);
        }

    }
}
