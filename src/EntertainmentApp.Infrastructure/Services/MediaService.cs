using EntertainmentApp.API.Helpers;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using MediatR;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;

namespace EntertainmentApp.Infrastructure.Services
{
    public class MediaService : IMediaService
    {
        private readonly IConfiguration _configuration;
        public MediaService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public Task<string> NormalizeFileName(string fileName)
        {
            string invalidChars = new string(Path.GetInvalidFileNameChars()) + new string(Path.GetInvalidPathChars());
            return Task.FromResult(string.Join("_", fileName.Split(invalidChars.ToCharArray(), StringSplitOptions.RemoveEmptyEntries)).TrimEnd('.'));
        }

        //private readonly string STORAGE_PATH = @"C:\MyVideoStorage";
        public async Task<FileUploadResult> UploadAsync(Stream bodyStream, string contentType, string category)
        {
            string baseMediaPath = _configuration["BaseStoragePath"] ?? "C://EnternainmentMedia";
            //string baseMediaPath = @"C:\MyVideoStorage";
            // 1. Prepare Boundary
            var boundary = MultipartRequestHelper.GetBoundary(MediaTypeHeaderValue.Parse(contentType), lengthLimit: 70_000);
            var reader = new MultipartReader(boundary, bodyStream);

            var section = await reader.ReadNextSectionAsync();
            string savedFilePath = "";
            string originalFileName = "";

            while (section != null)
            {
                var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out var contentDisposition);

                if (hasContentDispositionHeader && MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
                {
                    // sanitize the filename
                    originalFileName = HeaderUtilities.RemoveQuotes(contentDisposition.FileName).Value;
                    var trustedFileName = Path.GetFileName(originalFileName);

                    // Ensure directory exists
                    if (!Directory.Exists(baseMediaPath))
                    {
                        Directory.CreateDirectory(baseMediaPath);
                    }

                    savedFilePath = Path.Combine(baseMediaPath, trustedFileName);

                    using (var targetStream = File.Create(savedFilePath))
                    {
                        // Copies chunk by chunk (RAM efficient)
                        await section.Body.CopyToAsync(targetStream);
                    }
                }

                section = await reader.ReadNextSectionAsync();
            }

            if (string.IsNullOrEmpty(savedFilePath))
            {
                throw new Exception("No file was found in the multipart request.");
            }

            return new FileUploadResult
            {
                LocalFilePath = savedFilePath,
                OriginalFileName = originalFileName
            };
        }
    }
}
