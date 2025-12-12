using EntertainmentApp.API.Attributes;
using EntertainmentApp.API.Helpers;
using EntertainmentApp.Applicatoin.Common.Mappers;
using EntertainmentApp.Applicatoin.Common.Models;
using EntertainmentApp.Applicatoin.Dtos;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using EntertainmentApp.Domain.Entities.Video;
using EntertainmentApp.Shared.Exceptions;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using static EntertainmentApp.Applicatoin.Features.Movies.Command.CreateMovieHandler;

namespace EntertainmentApp.API.Controllers
{

    [ApiController]
    [Route("api/video")]
    public class VideoController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _env;
        private readonly IMediaService _mediaService;
        public VideoController(IMediator mediator, IWebHostEnvironment env, IMediaService mediaService)
        {
            _mediator = mediator;
            _env = env;
            _mediaService = mediaService;

        }

        [HttpPost("movie")]
        [DisableFormValueModelBinding] 
        [RequestSizeLimit(long.MaxValue)]

        public async Task<IActionResult> UploadMovieAsync()
        {
            MediaUploadResult mediaUploadResult = null;
            if (!MultipartRequestHelper.IsMultipartContentType(Request.ContentType))
            {
                return BadRequest("Request is not multipart.");
            }

            try
            {
                mediaUploadResult =  await _mediaService.UploadAsync(Request.Body, Request.ContentType, "video", "movie");
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

            CreateMovieCommand command = mediaUploadResult.Adapt<CreateMovieCommand>();
            Movie movieResult = await _mediator.Send(command);
            MovieDto movieDto = movieResult.ToMoveDto();






            return Ok(movieDto);

        }

      

    }
}
