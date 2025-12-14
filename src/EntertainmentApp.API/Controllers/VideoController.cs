using EntertainmentApp.API.Attributes;
using EntertainmentApp.API.Dtos;
using EntertainmentApp.API.Helpers;
using EntertainmentApp.Applicatoin.Common.Dtos;
using EntertainmentApp.Applicatoin.Common.Mappers;
using EntertainmentApp.Applicatoin.Common.Models;
using EntertainmentApp.Applicatoin.Features.Video.DeleteMovie;
using EntertainmentApp.Applicatoin.Features.Video.GetActor;
using EntertainmentApp.Applicatoin.Features.Video.GetMovieById;
using EntertainmentApp.Applicatoin.Features.Video.GetMovieGenres;
using EntertainmentApp.Applicatoin.Features.Video.GetMovieRefrenceData;
using EntertainmentApp.Applicatoin.Features.Video.GetMoviesAsync;
using EntertainmentApp.Applicatoin.Features.Video.UpdateMovie;
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


        [HttpPut("movie")]
        public async Task<IActionResult> UpdateMovieAsync([FromBody] UpdateMovieDto dto)
        {
            UpdateMovieCommand command = dto.Adapt<UpdateMovieCommand>();
            MovieDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("movie")]
        public async Task<IActionResult> GetAllMoviesAsync()
        {
            GetMoviesQuery query = new GetMoviesQuery();
            List<MovieDto> result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("movie/{id}")]
        public async Task<IActionResult> GetMovieByIdAsync([FromRoute] Guid id)
        {
            GetMovieByIdQuery query = new GetMovieByIdQuery(id);
            MovieDto movie = await _mediator.Send(query);
            return Ok(movie);
        }

        [HttpDelete("movie/{id}")]
        public async Task<IActionResult> DeleteMovieAsync([FromRoute] Guid id)
        {
            DeleteMovieCommand command = new DeleteMovieCommand(id);
            await _mediator.Send(command);
            return Ok("Deleted Successfully");
        }


        [HttpGet("actors")]
        public async Task<IActionResult> GetAllActor()
        {
            List<ActorDto> result = await _mediator.Send(new GetAllActorsQuery());
            return Ok(result);
        }


        [HttpGet("movie-genres")]
        public async Task<IActionResult> GetMovieGenre()
        {
            List<GenreDto> result = await _mediator.Send(new GetMovieGenresQuery());
            return Ok(result);
        }

        [HttpGet("refrence-data")]
        public async Task<IActionResult> GetMovieRefrenceData()
        {
            var result = await _mediator.Send(new GetMovieRefrenceDataQuery());
            return Ok(result);
        }
      

    }
}
