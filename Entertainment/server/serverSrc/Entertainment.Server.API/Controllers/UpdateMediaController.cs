namespace Entertainment.Server.API.Controllers
{
    [Route("api/update")]
    [ApiController]
    public class UpdateMediaController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UpdateMediaController(IMediator mediator)
        {
            _mediator = mediator;
        }

        //private readonly IMediaService _mediaService;
        [HttpGet("all-media/")]
        public async Task<IActionResult> GetAllMediaAsync()
        {
            var result = await _mediator.Send(new GetAllMediaQuery());
            return Ok(result);
        }
    }
}
