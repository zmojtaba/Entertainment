using EntertainmentApp.API.Attributes;
using EntertainmentApp.API.Dtos;
using EntertainmentApp.API.Helpers;
using EntertainmentApp.Applicatoin.Common.Dtos;
using EntertainmentApp.Applicatoin.Common.Mappers;
using EntertainmentApp.Applicatoin.Common.Models;
using EntertainmentApp.Applicatoin.Features.Video;
using EntertainmentApp.Applicatoin.Features.Video.MoviesFeature;
using EntertainmentApp.Applicatoin.Features.Video.SeriesFeature;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using EntertainmentApp.Domain.Entities.Video;
using EntertainmentApp.Shared.Exceptions;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using NAudio.Wave;
using static EntertainmentApp.Applicatoin.Features.Video.MoviesFeature.CreateMovieHandler;
using static EntertainmentApp.Applicatoin.Features.Video.SeriesFeature.CreateSeasonHandler;
using static EntertainmentApp.Applicatoin.Features.Video.SeriesFeature.DeleteEpisodeHandler;
using static EntertainmentApp.Applicatoin.Features.Video.SeriesFeature.DeleteSeasonHandler;
using static EntertainmentApp.Applicatoin.Features.Video.SeriesFeature.GetSeriesByIdHandler;


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
        public async Task<IActionResult> GetAllMoviesAsync([FromQuery] string? language, [FromQuery] string? genre)
        {
            GetMoviesQuery query = new GetMoviesQuery(language, genre);
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




        [HttpPost("series")]
        public async Task<IActionResult> CreateSeriesAsync([FromForm] CreateSeriesDto dto)
        {
            string posterImagePath = null;
            try
            {
                posterImagePath = await _mediaService.UploadPosterImage(dto.PosterImageFile);
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            CreateSeriesCommand command = new CreateSeriesCommand
            {
                Title = dto.Title,
                Description = dto.Description,
                Languages = dto.Languages,
                Countries = dto.Countries,
                AgeGroup = dto.AgeGroup,
                ImdbRating = dto.ImdbRating,
                PublishedDate = dto.PublishedDate,
                PosterImageUrl = posterImagePath,
                Genres = dto.Genres,
                Directors = dto.Directors,
                Actors = dto.Actors
            };
            SeriesDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("series")]
        public async Task<IActionResult> GetSeriesAsync([FromQuery] string? language, [FromQuery] string? genre)
        {
            GetSeriesQuery query = new GetSeriesQuery(language, genre);
            List<SeriesDto> result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("series/{id}")]
        public async Task<IActionResult> GetSeriesByIdAsync([FromRoute] Guid id)
        {
            GetSeriesByIdQuery query = new GetSeriesByIdQuery(id);
            SeriesDto result = await _mediator.Send(query);
            return Ok(result);
        }


        [HttpPut("series/")]
        public async Task<IActionResult> UpdateSeriedAsync([FromBody] UpdateSeriesDto dto)
        {
            UpdateSeriesCommand command = dto.Adapt<UpdateSeriesCommand>();
            SeriesDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("series/{id}")]
        public async Task<IActionResult> DelteSeriesAsync(Guid id)
        {
            DeleteSeriesCommand command = new DeleteSeriesCommand(id);
            await _mediator.Send(command);
            return Ok("successfully deleted");
        }


        [HttpPost("series/season")]
        [DisableFormValueModelBinding]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> CreateSeasonAsync()
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

            CreateSeasonCommand command = mediaUploadResult.Adapt<CreateSeasonCommand>();
            SeasonDto result = await _mediator.Send(command);
            return Ok(result);
        }


        [HttpDelete("series/season/{id}")]
        public async Task<IActionResult> DeleteSeasonAsync([FromRoute] Guid id)
        {
            DeleteSeasonCommand command = new DeleteSeasonCommand(id);
            await _mediator.Send(command);
            return Ok("Successfully Deleted");
        }

        [HttpDelete("seires/episode/{id}")]
        public async Task<IActionResult> DeleteSeasonEpisodeById([FromRoute] Guid id)
        {
            await _mediator.Send(new DeleteEpisodeCommand(id));
            return Ok("Successfully Deleted");
        }

    
    }
}
