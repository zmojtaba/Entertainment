

using Microsoft.AspNetCore.Http;

namespace Entertainment.Server.Applicatoin.Interfaces.Media
{

    public class FileUploadResult
    {
        public string LocalFilePath { get; set; }
        public string OriginalFileName { get; set; }
    }
    public interface IMediaService
    {
        public Task<MediaUploadResult> UploadAsync(Stream bodyStream, string contentType);
        public Task<string> UploadPosterImage(IFormFile file);
        public Task<string> MovePosterImage(string sourceFilePath, string title, string category, string subcategory);
        public Task<string> MoveStreamToExistenceDirectoryAsync(string SourceFilePath, string destinationDirectory);
        public Task DeleteFileAsync(string streamUrl, bool addBaseAddress=false);
        public Task DeleteMediaDirecoryAsync(string mediaDirectory, bool addBaseAddress = false);
        public Task<string> MoveMediaDirectory(string sourceDir, string title, string category, string subcategory, bool addBaseAddress = false);
    }
}

