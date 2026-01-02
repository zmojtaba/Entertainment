
using EntertainmentApp.Applicatoin.Features.Publication.MagazineFeature;
using EntertainmentApp.Applicatoin.Features.Publication.NewsPaperFeature;

namespace EntertainmentApp.API.Controllers
{
    [Route("api/publication")]
    [ApiController]
    public class PublicationController : ControllerBase
    {
        private readonly IMediaService _mediaService;
        private readonly IMediator _mediator;

        public PublicationController(IMediaService mediaService, IMediator mediator)
        {
            _mediaService = mediaService;
            _mediator = mediator;
        }


        [HttpPost("newspaper")]
        [DisableFormValueModelBinding]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> AddNewsPaperAsync()
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

            AddNewsPaperCommand command = new AddNewsPaperCommand
                {
                    Title = mediaUploadResult.Title,
                    Languages = mediaUploadResult.Languages,
                    Genres = mediaUploadResult.Genres,
                    Publisher = mediaUploadResult.Publisher,
                    PublishedDate = (long)mediaUploadResult.PublishedTime,
                    TempPosterImageUrl = mediaUploadResult.TempPosterImageUrl,
                    TempStreamUrl = mediaUploadResult.TempStreamUrl,
                    StreamFileName = mediaUploadResult.StreamFileName,
                    PosterImageFileName = mediaUploadResult.PosterImageFileName
            };
            NewsPaperDto result = await _mediator.Send(command);

            return Ok(result);
        }


        [HttpGet("newspaper")]
        public async Task<IActionResult> GetNewsPapersAsync([FromQuery] string? language, [FromQuery] string? genre)
        {
            List<NewsPaperDto> result = await _mediator.Send(new GetNewsPapersQuery(language, genre));
            return Ok(result);
        }

        [HttpGet("newspaper/{id}")]
        public async Task<IActionResult> GetNewsPaperByIdAsync([FromRoute] Guid id)
        {
            NewsPaperDto result = await _mediator.Send(new GetNewsPaperByIdQuery(id));
            return Ok(result);
        }

        [HttpPut("newspaper/")]
        public async Task<IActionResult> UpdateNewsPaperAsync([FromForm] UpdateNewsPaperDto dto)
        {

            string posterImagePath = null;
            if (dto.PosterImageFile != null)
            {

                try
                {
                    posterImagePath = await _mediaService.UploadPosterImage(dto.PosterImageFile);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            UpdateNewsPaperCommand command = new UpdateNewsPaperCommand
            {
                Id = dto.Id,
                Title = dto.Title,
                Languages = dto.Languages,
                TempPosterImageUrl = posterImagePath ?? "",
                Genres = dto.Genres,
                Publisher = dto.Publisher,
                PublishedDate = dto.PublishedDate
            };
            NewsPaperDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("newsPaper/{id}")]
        public async Task<IActionResult> DeleteNewsPaperAsync([FromRoute] Guid id)
        {
            DeleteNewsPaperCommand command = new DeleteNewsPaperCommand(id);
            await _mediator.Send(command);
            return Ok("Deleted Successfully");
        }

        [HttpGet("refrence-data")]
        public async Task<IActionResult> GetPublicationRefrenceData()
        {
            var result = await _mediator.Send(new GetPublicationRefrenceDataQuery());
            return Ok(result);
        }


        [HttpPost("magazine")]
        [DisableFormValueModelBinding]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> AddMagazineAsync()
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

            AddMagazineCommand command = new AddMagazineCommand
            {
                Title = mediaUploadResult.Title,
                Languages = mediaUploadResult.Languages,
                Genres = mediaUploadResult.Genres,
                Publisher = mediaUploadResult.Publisher,
                PublishedDate = (long)mediaUploadResult.PublishedTime,
                TempPosterImageUrl = mediaUploadResult.TempPosterImageUrl,
                TempStreamUrl = mediaUploadResult.TempStreamUrl,
                StreamFileName = mediaUploadResult.StreamFileName,
                PosterImageFileName = mediaUploadResult.PosterImageFileName
            };
            MagazineDto result = await _mediator.Send(command);

            return Ok(result);
        }


        [HttpGet("magazine")]
        public async Task<IActionResult> GetMagazinesAsync([FromQuery] string? language, [FromQuery] string? genre)
        {
            List<MagazineDto> result = await _mediator.Send(new GetMagazinesCommand(language, genre));
            return Ok(result);
        }

        [HttpGet("magazines/{id}")]
        public async Task<IActionResult> GetMagazineByIdAsync([FromRoute] Guid id)
        {
            MagazineDto result = await _mediator.Send(new GetMagazineByIdQuery(id));
            return Ok(result);
        }

        [HttpPut("magazine/")]
        public async Task<IActionResult> UpdateMagazineAsync([FromForm] UpdateNewsPaperDto dto)
        {

            string posterImagePath = null;
            if (dto.PosterImageFile != null)
            {

                try
                {
                    posterImagePath = await _mediaService.UploadPosterImage(dto.PosterImageFile);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            UpdateMagazineCommand command = new UpdateMagazineCommand
            {
                Id = dto.Id,
                Title = dto.Title,
                Languages = dto.Languages,
                TempPosterImageUrl = posterImagePath ?? "",
                Genres = dto.Genres,
                Publisher = dto.Publisher,
                PublishedDate = dto.PublishedDate
            };
            MagazineDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("magazine/{id}")]
        public async Task<IActionResult> DeleteMagazineAsync([FromRoute] Guid id)
        {
            DeleteMagazineCommand command = new DeleteMagazineCommand(id);
            await _mediator.Send(command);
            return Ok("Deleted Successfully");
        }


    }
}
