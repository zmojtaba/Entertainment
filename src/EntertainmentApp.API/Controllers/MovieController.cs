using EntertainmentApp.API.Attributes;
using EntertainmentApp.API.Helpers;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using static EntertainmentApp.Applicatoin.Features.Movies.Command.CreateMovieHandler;

namespace EntertainmentApp.API.Controllers
{

    [ApiController]
    [Route("api/movie")]
    public class MovieController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _env;
        private readonly IMediaService _mediaService;
        public MovieController(IMediator mediator, IWebHostEnvironment env, IMediaService mediaService)
        {
            _mediator = mediator;
            _env = env;
            _mediaService = mediaService;

        }
        [HttpPost("Stream")]
        public async Task<IActionResult> GetMovies([FromBody] CreateMovieCommand command)
        {
            string response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpPost]
        [DisableFormValueModelBinding] 
        [RequestSizeLimit(long.MaxValue)]

        public async Task<IActionResult> UploadMovieAsync()
        {
            // 1. Validate Content Type (Fast check before spinning up services)
            if (!MultipartRequestHelper.IsMultipartContentType(Request.ContentType))
            {
                return BadRequest("Request is not multipart.");
            }

            try
            {
                // 2. Stream the file to disk (Infrastructure Concern)
                // We pass Request.Body directly to keep memory usage low
                var uploadResult = await _mediaService.UploadAsync(Request.Body, Request.ContentType, "video");

                // 3. Dispatch CQRS Command (Application/Business Concern)
                //var command = new CreateMovieCommand
                //{
                //    Title = "Uploaded Video", // You might extract this from other form sections if they exist
                //    FilePath = uploadResult.LocalFilePath,
                //    OriginalFileName = uploadResult.OriginalFileName
                //};

                //var result = await _mediator.Send(command);

                return Ok(uploadResult);
            }
            catch (System.Exception ex)
            {
                // Log error
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //public async Task<IActionResult> UploadMovieAsync()
        //{

        //    // 1. Validate Content Type
        //    if (!MultipartRequestHelper.IsMultipartContentType(Request.ContentType))
        //    {
        //        return BadRequest("Request is not multipart.");
        //    }

        //    // 2. Stream the file to disk
        //    var boundary = MultipartRequestHelper.GetBoundary(MediaTypeHeaderValue.Parse(Request.ContentType), 70_000);
        //    var reader = new MultipartReader(boundary, Request.Body);
        //    var section = await reader.ReadNextSectionAsync();

        //    string savedFilePath = "";

        //    while (section != null)
        //    {
        //        var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out var contentDisposition);

        //        if (hasContentDispositionHeader && MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
        //        {
        //            // This is the file part
        //            var fileName = Path.GetFileName(
        //                HeaderUtilities.RemoveQuotes(contentDisposition.FileName).Value);
        //            savedFilePath = Path.Combine(@"C:\MyVideoStorage", fileName); // Choose your storage path

        //            using (var targetStream = System.IO.File.Create(savedFilePath))
        //            {
        //                // This copies chunk by chunk without RAM spike
        //                await section.Body.CopyToAsync(targetStream);
        //            }
        //        }

        //        section = await reader.ReadNextSectionAsync();
        //    }

        //    // 3. Dispatch CQRS Command
        //    // Now that the file is safe on disk, tell the domain to register it
        //    //var command = new CreateVideoCommand
        //    //{
        //    //    Title = "Uploaded Video",
        //    //    FilePath = savedFilePath
        //    //};

        //    //var result = await _mediator.Send(command);

        //    return Ok("ok");
        //}



    }
}
