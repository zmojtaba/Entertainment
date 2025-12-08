using MediatR;
using Microsoft.AspNetCore.Mvc;
using static EntertainmentApp.Applicatoin.Features.Movies.Command.CreateMovieHandler;

namespace EntertainmentApp.API.Controllers
{

    [ApiController]
    [Route("api/Movie")]
    public class MovieController : ControllerBase
    {
        private readonly IMediator _mediator;
        public MovieController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpPost("get")]
        public async Task<IActionResult> GetMovies([FromBody] CreateMovieCommand command)
        {
            string response = await _mediator.Send(command);
            return Ok(response);
        }
    }
}
