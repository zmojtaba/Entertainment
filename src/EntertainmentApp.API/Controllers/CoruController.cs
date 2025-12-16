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
using static EntertainmentApp.Applicatoin.Features.CoruFeature.CreateCoruHandler;
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


        [HttpGet("play")]
        public IActionResult Play()
        {
            string path = @"C:\EnternainmentMedia\temp\Moein - Tolou.mp3";
            if (!System.IO.File.Exists(path))
                return BadRequest("boro gom bosho");

            _audioPlayer.Play(path);
            return Ok("playing");
        }

        [HttpGet("stop")]
        public IActionResult Stop()
        {
            _audioPlayer.Stop();
            return Ok("stopped");
        }

        [HttpGet]
        public async Task<IActionResult> GetCorusAsync()
        {

            return Ok();
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

        [HttpDelete("id")]
        public async Task<IActionResult> DeleteCoruAsync([FromRoute] Guid id)
        {
            return Ok();
        }



    }
}
