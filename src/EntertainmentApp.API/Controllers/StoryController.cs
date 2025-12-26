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

        [HttpPut("podcast/")]
        public async Task<IActionResult> UpdatePodCastAsync([FromForm] UpdatePodCastDto dto)
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

            UpdatePodCastCommand command = new UpdatePodCastCommand
            {
                Id = dto.Id,
                Title = dto.Title,
                Description = dto.Description,
                Languages = dto.Languages,
                AgeGroup = dto.AgeGroup,
                PosterImageUrl = posterImagePath ?? "",
                Genres = dto.Genres,
                Speakers = dto.Speakers
            };
            PodCastDto result = await _mediator.Send(command);
            return Ok(result);

        }

        [HttpDelete("podcast/{id}")]
        public async Task<IActionResult> DeletePodCastAsync([FromRoute] Guid id)
        {
            DeletePodCastCommand comand = new DeletePodCastCommand(id);
            await _mediator.Send(comand);
            return Ok("Deleted Successfully");
        }



        [HttpPost("podcast/episode")]
        [DisableFormValueModelBinding]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> AddPodCastEpisode()
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

            AddPodCastEpisodeCommand command = new AddPodCastEpisodeCommand
            {
                Title = mediaUploadResult.Title,
                TempStreamUrl = mediaUploadResult.TempStreamUrl,
                AudioStoryId = mediaUploadResult.SeriesId,
            };
            var result = await _mediator.Send(command);

            return Ok(result);
        }

        [HttpDelete("podcast/episode/{id}")]
        public async Task<IActionResult> DeletePodCastEpisode([FromRoute] Guid id)
        {
            DeletePodCastEpisodeCommand command = new DeletePodCastEpisodeCommand(id);
            await _mediator.Send(command);
            return Ok("Deleted Successfully");
        }






        [HttpPost("audio-story/")]
        public async Task<IActionResult> AddAudioStoryAsync([FromForm] AddPodCastDto dto)
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

            AddAudioStoryCommand command = new AddAudioStoryCommand
            {
                Title = dto.Title,
                Description = dto.Description,
                Languages = dto.Languages,
                AgeGroup = dto.AgeGroup,
                PosterImageUrl = posterImagePath,
                Genres = dto.Genres,
                Speakers = dto.Speakers
            };
            AudioStoryDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("audio-story/")]
        public async Task<IActionResult> GetAudioStoryAsync([FromQuery] string? language, [FromQuery] string? genre)
        {
            List<AudioStoryDto> result = await _mediator.Send(new GetAudioStoryQuery(language, genre));
            return Ok(result);
        }


        [HttpGet("audio-story/{id}")]
        public async Task<IActionResult> GetAudioStoryByIdAsync([FromRoute] Guid id)
        {
            AudioStoryDto result = await _mediator.Send(new GetAudioStoryByIdQuery(id));
            return Ok(result);

        }


        [HttpPut("audio-story/")]
        public async Task<IActionResult> UpdateAudioStoryAsync([FromForm] UpdatePodCastDto dto)
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

            UpdateAudioStoryCommand command = new UpdateAudioStoryCommand
            {
                Id = dto.Id,
                Title = dto.Title,
                Description = dto.Description,
                Languages = dto.Languages,
                AgeGroup = dto.AgeGroup,
                PosterImageUrl = posterImagePath ?? "",
                Genres = dto.Genres,
                Speakers = dto.Speakers
            };
            AudioStoryDto result = await _mediator.Send(command);
            return Ok(result);

        }

        [HttpDelete("audio-story/{id}")]
        public async Task<IActionResult> DeleteAudioStoryAsync([FromRoute] Guid id)
        {
            DeleteAudioStoryCommand comand = new DeleteAudioStoryCommand(id);
            await _mediator.Send(comand);
            return Ok("Deleted Successfully");
        }


        [HttpPost("audio-story/episode")]
        [DisableFormValueModelBinding]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> AddAudioStoryEpisode()
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

            AddAudioStoryEpisodeCommand command = new AddAudioStoryEpisodeCommand
            {
                Title = mediaUploadResult.Title,
                TempStreamUrl = mediaUploadResult.TempStreamUrl,
                AudioStoryId = mediaUploadResult.SeriesId,
            };
            var result = await _mediator.Send(command);

            return Ok(result);
        }



        [HttpDelete("audio-story/episode/{id}")]
        public async Task<IActionResult> DeleteAudioStoryEpisode([FromRoute] Guid id)
        {
            DeleteAudioStoryEpisodeCommand command = new DeleteAudioStoryEpisodeCommand(id);
            await _mediator.Send(command);
            return Ok("Deleted Successfully");
        }







    }
}
