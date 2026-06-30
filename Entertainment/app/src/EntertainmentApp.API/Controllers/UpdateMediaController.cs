using EntertainmentApp.Application.Common.Enums;
using EntertainmentApp.Domain.Enums;
using Microsoft.AspNetCore.SignalR;

namespace EntertainmentApp.API.Controllers
{
    [Route("api/update-media")]
    [ApiController]
    public class UpdateMediaController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IHubContext<DownloadHub> _hub;

        public UpdateMediaController(IMediator mediator, IHubContext<DownloadHub> hub)
        {
            _mediator = mediator;
            _hub = hub;
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("sync/")]
        public async Task<IActionResult> SyncMediaWithServerAsync()
        {
            var result = await _mediator.Send(new SyncMediaWithServerCommand());
            return Ok(result);
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("download-queue/")]
        public async Task<IActionResult> GetMediaDownloadQueueAsync()
        {
            var result = await _mediator.Send(new GetMediaDownloadQueueQuery());
            return Ok(result);
        }

        // [Authorize(Roles = "Admin")]
        [HttpGet("connection-status/")]
        public async Task<IActionResult> GetConnectionStatus()
        {
            var result = await _mediator.Send(new GetConnectionStatusQuery());
            return Ok(result);
        }




        [HttpGet("test-publish-message")]
        public async Task<IActionResult> TestPublishSignalR()
        {
            DownloadProgress progress = new DownloadProgress
            {
                Id = Guid.NewGuid(),
                //EpisodeId = Guid.NewGuid(),
                MediaType = MediaType.Movie.ToString(),
                FileType = "Stream",
                Percentage = 50.01,
                DownloadedBytes = 232010,
                TotalBytes = 865325124,
                Status = DownloadStatus.Downloading,
                ErrorMessage = "asdflkasjdfs"

            };
            await _hub.Clients.All.SendAsync("DownloadProgress", progress);
            return Ok("asdf");
        }





    }
}
