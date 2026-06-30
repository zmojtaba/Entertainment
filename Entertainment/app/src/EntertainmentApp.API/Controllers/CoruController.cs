namespace EntertainmentApp.API.Controllers
{
    //[Authorize]
    [Route("api/coru")]
    [ApiController]
    public class CoruController : ControllerBase
    {
        private readonly IAudioPlayerService _audioPlayer;
        private readonly IMediaService _mediaService;
        private readonly IMediator _mediator;
        public CoruController(IAudioPlayerService audioPlayer, IMediaService mediaService, IMediator mediator)
        {
            _audioPlayer = audioPlayer;
            _mediaService = mediaService;
            _mediator = mediator;
        }

        [Authorize]
        [HttpGet("play/{id}")]
        public async Task<IActionResult> Play([FromRoute] Guid id)
        {
            bool result = await _mediator.Send(new PlayCoruCommand(id));
            return Ok("playing");
        }

        [Authorize]
        [HttpGet("stop/{id}")]
        public async Task<IActionResult> Stop([FromRoute] Guid id)
        {
            bool result = await _mediator.Send(new StopCoruCommand(id));
            //_audioPlayer.Stop();
            return Ok("stopped");
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetCorusAsync()
        {
            List<CoruDto> corus = await _mediator.Send(new GetCorousQuery());
            return Ok(corus);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [DisableFormValueModelBinding]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> CreateCoruAsync()
        {
            MediaUploadResult mediaUploadResult = null;
            if (!MultipartRequestHelper.IsMultipartContentType(Request.ContentType))
            {
                return BadRequest("Request is not multipart.");
            }

            try
            {
                mediaUploadResult = await _mediaService.UploadAsync(Request.Body, Request.ContentType);
            }
            catch (BadRequestException ex)
            {
                return StatusCode(400, ex.Message);
            }
            catch (Exception ex)
            {
                // Log error
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            if (mediaUploadResult == null)
            {
                return BadRequest("Form Data is required");
            }



            CreateCoruCommand command = mediaUploadResult.Adapt<CreateCoruCommand>();
            CoruDto result = await _mediator.Send(command);

            return Ok(result);
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoruAsync([FromRoute] Guid id)
        {
            await _mediator.Send(new DeleteCoruCommand(id));
            return Ok("Deleted Successfully");
        }
    }
}
