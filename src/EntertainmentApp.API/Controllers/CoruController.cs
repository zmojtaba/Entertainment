using EntertainmentApp.API.Attributes;
using EntertainmentApp.API.Helpers;
using EntertainmentApp.Applicatoin.Common.Models;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using EntertainmentApp.Domain.Entities;
using EntertainmentApp.Domain.Entities.Video;
using EntertainmentApp.Infrastructure.Services;
using EntertainmentApp.Shared.Exceptions;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using static EntertainmentApp.Applicatoin.Features.CoruFeature.CreateCoruHandler;
using static EntertainmentApp.Applicatoin.Features.CoruFeature.DeleteCoruHandler;
using static EntertainmentApp.Applicatoin.Features.CoruFeature.GetCorusHandler;
using static EntertainmentApp.Applicatoin.Features.CoruFeature.PlayCoruHandler;
using static EntertainmentApp.Applicatoin.Features.CoruFeature.StopCoruHandler;
using static EntertainmentApp.Applicatoin.Features.Video.MoviesFeature.CreateMovieHandler;

namespace EntertainmentApp.API.Controllers
{
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


        [HttpGet("play/{id}")]
        public async Task<IActionResult> Play([FromRoute] Guid id)
        {
            bool result = await _mediator.Send(new PlayCoruCommand(id));
            return Ok("playing");
        }

        [HttpGet("stop/{id}")]
        public async Task<IActionResult> Stop([FromRoute] Guid id)
        {
            bool result = await _mediator.Send(new StopCoruCommand(id));
            //_audioPlayer.Stop();
            return Ok("stopped");
        }

        [HttpGet]
        public async Task<IActionResult> GetCorusAsync()
        {
            List<Coru> corus = await _mediator.Send(new GetCorousCommand());
            return Ok(corus);
        }

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
                mediaUploadResult = await _mediaService.UploadAsync(Request.Body, Request.ContentType, "coru", "movie");
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
            Coru result = await _mediator.Send(command);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoruAsync([FromRoute] Guid id)
        {
            await _mediator.Send(new DeleteCoruCommand(id));
            return Ok("Deleted Successfully");
        }



    }
}
