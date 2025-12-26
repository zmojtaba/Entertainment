using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static EntertainmentApp.Applicatoin.Features.Music.TrackFeatur.AddTrackHandler;

namespace EntertainmentApp.API.Controllers
{
    [Route("api/music")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        private readonly IMediaService _mediaService;
        private readonly IMediator _mediator;

        public MusicController(IMediaService mediaService, IMediator mediator)
        {
            _mediaService = mediaService;
            _mediator = mediator;
        }

        [HttpPost("track")]
        [DisableFormValueModelBinding]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> AddTrackAsync()
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

            AddTrackCommand command = mediaUploadResult.Adapt<AddTrackCommand>();
            var result = await _mediator.Send(command);

            return Ok(result);
        }



    }
}
