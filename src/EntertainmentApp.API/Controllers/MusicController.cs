using EntertainmentApp.Applicatoin.Features.Music.AlbumFeature;
using EntertainmentApp.Applicatoin.Features.Music.TrackFeatur;
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


        [HttpGet("track")]
        public async Task<IActionResult> GetTracksAsync([FromQuery] string? language, [FromQuery] string? genre)
        {
            List<TrackDto> result = await _mediator.Send(new GetTracksQuery(language, genre));
            return Ok(result);
        }

        [HttpGet("track/{id}")]
        public async Task<IActionResult> GetTracksByIdAsync([FromRoute] Guid id)
        {
            TrackDto result = await _mediator.Send(new GetTrackByIdQuery(id));
            return Ok(result);
        }

        [HttpPut("track/")]
        public async Task<IActionResult> UpdateTrackAsync([FromForm] UpdateTrackDto dto)
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

            UpdateTrackCommand command = new UpdateTrackCommand
            {
                Id = dto.Id,
                Title = dto.Title,
                Languages = dto.Languages,
                PosterImageUrl = posterImagePath ?? "",
                Genres = dto.Genres,
                Singer = dto.Singer
            };
            TrackDto result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("track/{id}")]
        public async Task<IActionResult> DeleteTrackAsync([FromRoute] Guid id)
        {
            DeleteTrackCommand command = new DeleteTrackCommand(id);
            await _mediator.Send(command);
            return Ok("Deleted Successfully");
        }

        [HttpGet("refrence-data")]
        public async Task<IActionResult> GetMusicRefrenceData()
        {
            var result = await _mediator.Send(new GetMusicRefrenceDataQuery());
            return Ok(result);
        }



        [HttpPost("album/")]
        public async Task<IActionResult> AddAlbumAsync([FromForm] AddAlbumDto dto)
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

            AddAlbumCommand command = new AddAlbumCommand
            {
                Title = dto.Title,
                Languages = dto.Languages,
                PosterImageUrl = posterImagePath,
                Genres = dto.Genres,
                Singer = dto.Singer
            };
            AlbumDto result = await _mediator.Send(command);
            return Ok(result);
        }


        [HttpGet("album/")]
        public async Task<IActionResult> GetAlbumsAsync([FromQuery] string? language, [FromQuery] string? genre)
        {
            List<AlbumDto> result = await _mediator.Send(new GetAlbumQuery(language, genre));
            return Ok(result);
        }

        [HttpGet("album/{id}")]
        public async Task<IActionResult> GetAlbumByIdAsync([FromRoute] Guid id)
        {
            AlbumDto result = await _mediator.Send(new GetAlbumByIdQuery(id));
            return Ok(result);

        }

        [HttpPut("album/")]
        public async Task<IActionResult> UpdateAlbumAsync([FromForm] UpdateAlbumDto dto)
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

            UpdateAlbumCommand command = new UpdateAlbumCommand
            {
                Id = dto.Id,
                Title = dto.Title,
                Languages = dto.Languages,
                PosterImageUrl = posterImagePath ?? "",
                Genres = dto.Genres,
                Singer = dto.Singer
            };
            AlbumDto result = await _mediator.Send(command);
            return Ok(result);

        }

        [HttpDelete("album/{id}")]
        public async Task<IActionResult> DeleteAlbumAsync([FromRoute] Guid id)
        {
            DeleteAlbumCommand comand = new DeleteAlbumCommand(id);
            await _mediator.Send(comand);
            return Ok("Deleted Successfully");
        }



        [HttpPost("album/episode")]
        [DisableFormValueModelBinding]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> AddAlbumEpisode()
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

            AddAlbumEpisodeCommand command = new AddAlbumEpisodeCommand
            {
                Title = mediaUploadResult.Title,
                TempStreamUrl = mediaUploadResult.TempStreamUrl,
                AlbumId = mediaUploadResult.SeriesId,
            };
            var result = await _mediator.Send(command);

            return Ok(result);
        }

        [HttpDelete("album/episode/{id}")]
        public async Task<IActionResult> DeleteAlbumEpisode([FromRoute] Guid id)
        {
            DeleteAlbumEpisodeCommand command = new DeleteAlbumEpisodeCommand(id);
            await _mediator.Send(command);
            return Ok("Deleted Successfully");
        }
    }
}
