using EntertainmentApp.API.Attributes;
using EntertainmentApp.API.Dtos;
using EntertainmentApp.API.Helpers;
using EntertainmentApp.Applicatoin.Common.Dtos;
using EntertainmentApp.Applicatoin.Common.Models;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using EntertainmentApp.Shared.Exceptions;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static EntertainmentApp.Applicatoin.Features.BookFeature.AddBookHandler;
using static EntertainmentApp.Applicatoin.Features.BookFeature.GetBookByIdHandler;
using static EntertainmentApp.Applicatoin.Features.BookFeature.GetBookHandler;
using static EntertainmentApp.Applicatoin.Features.BookFeature.UpdateBookHandler;

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
        public async Task<IActionResult> GetBooksAsync()
        {
            List<BookDto> result = await _mediator.Send(new GetBooksQuery());
            return Ok(result);
        }

        [HttpGet("book/{id}")]
        public async Task<IActionResult> GetBooksByIdAsync([FromRoute] Guid id)
        {
            BookDto result = await _mediator.Send(new GetBookByIdQuery(id));
            return Ok(result);
        }

        [HttpPut("book/")]
        public async Task<IActionResult> UpdateBookAsync([FromBody]  UpdateBookDto dto)
        {
            UpdateBookCommand command = dto.Adapt<UpdateBookCommand>();
            BookDto result = await _mediator.Send(command);
            return Ok(result);
        }

    }
}
