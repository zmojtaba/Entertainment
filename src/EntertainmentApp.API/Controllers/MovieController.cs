using MediatR;
using Microsoft.AspNetCore.Mvc;
using static EntertainmentApp.Applicatoin.Features.Movies.Command.CreateMovieHandler;

namespace EntertainmentApp.API.Controllers
{

    [ApiController]
    [Route("api/Movie")]
    public class MovieController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _env;
        public MovieController(IMediator mediator, IWebHostEnvironment env)
        {
            _mediator = mediator;
            _env = env;
        }
        [HttpPost("get")]
        public async Task<IActionResult> GetMovies([FromBody] CreateMovieCommand command)
        {
            string response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadMovie(FormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Optional: check file type
            var allowedExtensions = new[] { ".mp4", ".mov", ".avi", ".mkv" };
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
                return BadRequest("Invalid file type.");

            // Generate a unique filename
            var fileName = $"{Guid.NewGuid()}{extension}";

            // Path to save the video (on the same PC)
            var uploadPath = Path.Combine(_env.ContentRootPath, "UploadedVideos");

            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var filePath = Path.Combine(uploadPath, fileName);

            // Save the video to disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { FileName = fileName, Path = filePath });
        }
    }
}
