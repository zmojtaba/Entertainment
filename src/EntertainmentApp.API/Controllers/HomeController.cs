using EntertainmentApp.Applicatoin.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EntertainmentApp.API.Controllers
{
    [Route("api/")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IMediator _mediator;

        public HomeController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("genre/{category}")]
        public async Task<IActionResult> CreateGenreAsync([FromBody] CreateGenreDto dto, [FromRoute] string category)
        {

            CreateGenreCommand command = new CreateGenreCommand(dto.Genres, category);
            CreateGenreResponse result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("genre/{title}/{category}")]
        public async Task<IActionResult> DeleteGenreAsync([FromRoute] string title, [FromRoute] string category)
        {
            DeleteGenreCommand command = new DeleteGenreCommand(title, category);
            await _mediator.Send(command);
            return Ok("Deleted Successfully");
        }
    }
}
