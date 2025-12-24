using EntertainmentApp.API.Attributes;
using EntertainmentApp.API.Dtos;
using EntertainmentApp.API.Helpers;
using EntertainmentApp.Applicatoin.Common.Dtos;
using EntertainmentApp.Applicatoin.Common.Models;
using EntertainmentApp.Applicatoin.Features.Video;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using EntertainmentApp.Shared.Exceptions;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static EntertainmentApp.Applicatoin.Features.BookFeature.GetBookRefrenceDataHandler;
using static EntertainmentApp.Applicatoin.Features.Story.BookFeature.AddBookHandler;
using static EntertainmentApp.Applicatoin.Features.Story.BookFeature.DeleteBookHandler;
using static EntertainmentApp.Applicatoin.Features.Story.BookFeature.GetBookByIdHandler;
using static EntertainmentApp.Applicatoin.Features.Story.BookFeature.GetBookHandler;
using static EntertainmentApp.Applicatoin.Features.Story.BookFeature.UpdateBookHandler;
using static EntertainmentApp.Applicatoin.Features.Story.PodCastFeature.AddPodCastHandler;
using static EntertainmentApp.Applicatoin.Features.Story.PodCastFeature.GetPodCastByIdHandler;
using static EntertainmentApp.Applicatoin.Features.Story.PodCastFeature.GetPodCastHandler;

namespace EntertainmentApp.API.Controllers
{
    [Route("api/story")]
    [ApiController]
    public class StoryController : ControllerBase
    {
        private readonly IMediaService _mediaService;
        private readonly IMediator _mediator;

        public StoryController(IMediaService mediaService, IMediator mediator)
        {
            _mediaService = mediaService;
            _mediator = mediator;
        }

        [HttpPost("book")]
        [DisableFormValueModelBinding]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> AddBookAsync()
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

            AddBookCommand command = mediaUploadResult.Adapt<AddBookCommand>();
            var result = await _mediator.Send(command);

            return Ok(result);
        }



        [HttpGet("book")]
        public async Task<IActionResult> GetBooksAsync([FromQuery] string? language, [FromQuery] string? genre)
        {
            List<BookDto> result = await _mediator.Send(new GetBooksQuery(language, genre));
            return Ok(result);
        }

        [HttpGet("book/{id}")]
        public async Task<IActionResult> GetBooksByIdAsync([FromRoute] Guid id)
        {
            BookDto result = await _mediator.Send(new GetBookByIdQuery(id));
            return Ok(result);
        }

        [HttpPut("book/")]
        public async Task<IActionResult> UpdateBookAsync([FromBody] UpdateBookDto dto)
        {
            UpdateBookCommand command = dto.Adapt<UpdateBookCommand>();
            BookDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("book/{id}")]
        public async Task<IActionResult> DeleteBookAsync([FromRoute] Guid id)
        {
            DeleteBookCommand command = new DeleteBookCommand(id);
            await _mediator.Send(command);
            return Ok("Deleted Successfully");
        }

        [HttpGet("refrence-data")]
        public async Task<IActionResult> GetBookRefrenceData()
        {
            var result = await _mediator.Send(new GetBookRefrenceDataQuery());
            return Ok(result);
        }

        [HttpPost("podcast/")]
        public async Task<IActionResult> AddPodcastAsync([FromForm] AddPodCastDto dto)
        {
            string posterImagePath = null;
            try
            {
                posterImagePath = await _mediaService.UploadPosterImage(dto.PosterImageFile);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            AddCodCastCommand command = new AddCodCastCommand
            {
                Title = dto.Title,
                Description = dto.Description,
                Languages = dto.Languages,
                AgeGroup = dto.AgeGroup,
                PosterImageUrl = posterImagePath,
                Genres = dto.Genres,
                Speakers = dto.Speakers
            };
            PodCastDto result = await _mediator.Send(command);
            return Ok(result);
        }


        [HttpGet("podcast/")]
        public async Task<IActionResult> GetPodCastsAsync([FromQuery] string? language, [FromQuery] string? genre)
        {
            List<PodCastDto> result = await _mediator.Send(new GetPodCastQuery(language, genre));
            return Ok(result);
        }

        [HttpGet("podcast/{id}")]
        public async Task<IActionResult> GetPodCastByIdAsync([FromRoute] Guid id)
        {
            PodCastDto result = await _mediator.Send(new GetPodCastByIdQuery(id));
            return Ok(result);

        }

        [HttpPut("podcast/{id}")]
        public async Task<IActionResult> UpdatePodCastAsync([FromBody] UpdatePodCastDto dto)
        {
            // To be implemented
            return StatusCode(501, "Not Implemented");

        }
    }
}
