

using Microsoft.AspNetCore.Http;

namespace EntertainmentApp.Infrastructure.Services
{
    public class MediaService : IMediaService
    {
        private readonly IConfiguration _configuration;
        public MediaService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<MediaUploadResult> UploadAsync( Stream bodyStream, string contentType)
        {
            var mediaUploadResult = new MediaUploadResult();
            string baseMediaPath = _configuration["BaseStoragePath"] ?? "C://EntertainmentMedia";

            var boundary = MultipartRequestHelper.GetBoundary(
                MediaTypeHeaderValue.Parse(contentType),
                70_000);

            var reader = new MultipartReader(boundary, bodyStream);
            MultipartSection section;

            string tempPath = Path.Combine(baseMediaPath, "temp");
            string streamPath = null;
            string streamFileName = null;
            string posterFileName = null;
            string posterPath = null;

            while ((section = await reader.ReadNextSectionAsync()) != null)
            {

                if (!ContentDispositionHeaderValue.TryParse(
                    section.ContentDisposition, out var disposition))
                    continue;

                // FILE
                if (MultipartRequestHelper.HasFileContentDisposition(disposition))
                {
                    string name = HeaderUtilities.RemoveQuotes(disposition.Name).Value;
                    string fileName = Path.GetFileName(HeaderUtilities.RemoveQuotes(disposition.FileName).Value);

                    //var fileExtention = Path.GetExtension(safeName);

                    if (!IsValidExtension(Path.GetExtension(fileName))) throw new BadRequestException("File is not in valid format");

                    if (!Directory.Exists(tempPath) ) Directory.CreateDirectory(tempPath);
                    fileName = Guid.NewGuid().ToString("N") + "_" + fileName;
                    string storagePath = Path.Combine(tempPath, fileName);

                    if (name.Equals("video", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!IsValidExtension(fileName, "video"))
                        {
                            if (File.Exists(posterPath)) File.Delete(posterPath);
                            throw new BadRequestException($"Invalid video file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.VideoExtension)}");
                        }

                        streamPath = storagePath;
                        streamFileName = fileName;
                    }
                    if (name.Equals("ebook", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!IsValidExtension(fileName, "ebook"))
                        {
                            if (File.Exists(posterPath)) File.Delete(posterPath);
                            throw new BadRequestException($"Invalid ebook file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.BookExtension)}");
                        }

                        streamPath = storagePath;
                        streamFileName = fileName;
                    }
                    if (name.Equals("audio", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!IsValidExtension(fileName, "music"))
                        {
                            if (File.Exists(posterPath)) File.Delete(posterPath);
                            throw new BadRequestException($"Invalid audio file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.AudioExtension)}");
                        }

                        streamPath = storagePath;
                        streamFileName = fileName;
                    }

                    else if (name.Equals("poster", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!IsValidExtension(fileName, "image"))
                        {
                            if (File.Exists(streamPath)) File.Delete(streamPath);
                            throw new BadRequestException($"Invalid poster file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.ImageExtension)}");

                        }

                        posterPath = storagePath;
                        posterFileName = fileName;
                    }

                        using var target = File.Create(storagePath);
                    await section.Body.CopyToAsync(target);
                }
                // FORM FIELD
                else if (MultipartRequestHelper.HasFormDataContentDisposition(disposition))
                {
                    using var reader2 = new StreamReader(section.Body);
                    var value = await reader2.ReadToEndAsync();
                    var key = HeaderUtilities.RemoveQuotes(disposition.Name).Value;

                    MapToDto(mediaUploadResult, key, value);
                }
            }
            //if (posterPath == null)
            //    throw new BadRequestException("Poster Image file required.");

            if (streamPath == null )
                throw new BadRequestException("Media file is required.");

            mediaUploadResult.TempStreamUrl = streamPath;
            mediaUploadResult.TempPosterImageUrl =posterPath ;
            mediaUploadResult.StreamFileName = streamFileName;
            mediaUploadResult.PosterImageFileName = posterFileName;
            return mediaUploadResult;


        }

        public async Task<string> UploadPosterImage(IFormFile file)
        {
            byte[] imageBytes;
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                imageBytes = memoryStream.ToArray();
            }
            string imageName = Guid.NewGuid()+"_" + file.FileName;
            string tempPath = Path.Combine(_configuration["BaseStoragePath"], "temp", imageName);
            File.WriteAllBytes(tempPath, imageBytes);
            return tempPath;
        }

        public Task DeleteMediaFilesAsync(string streamUrl, string posterUrl, bool addBaseAddress = false)
        {
            if (addBaseAddress)
            {
                streamUrl = Path.Combine(_configuration["BaseStoragePath"], streamUrl);
                posterUrl = Path.Combine(_configuration["BaseStoragePath"], posterUrl);
            }
            // delete file from disk / cloud storage
            if (File.Exists(streamUrl)) File.Delete(streamUrl);
            if (File.Exists(posterUrl)) File.Delete(posterUrl);

            return Task.CompletedTask;
        }

        public Task DeleteMediaDirecoryAsync(string mediaDirectory, bool addBaseAddress = false)
        {
            if (addBaseAddress) mediaDirectory = Path.Combine(_configuration["BaseStoragePath"], mediaDirectory);
            if (Directory.Exists(mediaDirectory)) Directory.Delete(mediaDirectory, recursive: true);
            return Task.CompletedTask;
        }



        public Task<string> MoveMediaDirectory(string sourceDir,  string title, string category, string subcategory, bool addBaseAddress = false)
        {
            string generateServPath = GenerateServePath(title, category, subcategory);
            string destinationDir = Path.Combine(_configuration["BaseStoragePath"], generateServPath);
            //if (!Directory.Exists(destinationDir)) Directory.CreateDirectory(destinationDir);
            if (addBaseAddress) sourceDir = Path.Combine(_configuration["BaseStoragePath"], sourceDir);

            Directory.Move(sourceDir, destinationDir);
            return Task.FromResult(generateServPath);

        }


        public Task<string> MovePosterImage(string sourceFilePath, string title, string category, string subcategory)
        {
            string generateServPath = GenerateServePath(title, category, subcategory);
            string destinationDir = Path.Combine(_configuration["BaseStoragePath"], generateServPath);
            if (!Directory.Exists(destinationDir)) Directory.CreateDirectory(destinationDir);
            string fileName = Path.GetFileName(sourceFilePath);
            string destinationFilePath = Path.Combine(destinationDir, fileName);
            File.Move(sourceFilePath, destinationFilePath);
            return Task.FromResult(Path.Combine(generateServPath, fileName));
        }

        public Task<string> MoveStreamToExistenceDirectoryAsync(string SourceFilePath, string destinationDirectory)
        {
            if (!File.Exists(SourceFilePath)) throw new InternalServerException("Can not store media file try again later");
            string desDirectory = Path.Combine(_configuration["BaseStoragePath"], destinationDirectory);
            if (!Directory.Exists(desDirectory)) Directory.CreateDirectory(desDirectory);
            string fileName = Path.GetFileName(SourceFilePath);
            File.Move(SourceFilePath, Path.Combine(desDirectory, fileName));
            return Task.FromResult(Path.Combine(destinationDirectory, fileName));
        }

        private static string GenerateServePath(string title, string category, string subcategory)
        {
            string TitlePath = CleanFileName(title.Trim()) + "_" + Guid.NewGuid().ToString("N");
            if (category.Equals("music", StringComparison.OrdinalIgnoreCase))
            {
                //title should be singer here.
                TitlePath = CleanFileName(title);
            }
            return Path.Combine(category, subcategory, TitlePath);
            
        }

        private static bool IsValidExtension(string fileName, string category)
        {
            string extension = Path.GetExtension(fileName);
            if (category.Equals("video", StringComparison.OrdinalIgnoreCase)) return ValidExtensionList.VideoExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);
            if (category.Equals("music", StringComparison.OrdinalIgnoreCase)) return ValidExtensionList.AudioExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);
            if (category.Equals("image", StringComparison.OrdinalIgnoreCase)) return ValidExtensionList.ImageExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);
            if (category.Equals("ebook", StringComparison.OrdinalIgnoreCase)) return ValidExtensionList.BookExtension.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                    ValidExtensionList.AudioExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);
            return false;

        }

        private static bool IsValidExtension(string extension)
        {
            if (
                ValidExtensionList.BookExtension.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                ValidExtensionList.AudioExtension.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                ValidExtensionList.VideoExtension.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                ValidExtensionList.ImageExtension.Contains(extension, StringComparer.OrdinalIgnoreCase)
                ) return true;
            return false;
        }

        private static string CleanFileName(string name)
        {
            foreach (var c in Path.GetInvalidFileNameChars())
            {
                name = name.Replace(c.ToString(), "");
            }
            return name;
        }

        private static void MapToDto(MediaUploadResult dto, string key, string value)
        {
            switch (key.ToLower())
            {
                case "seriesid":
                    dto.SeriesId = Guid.Parse(value);
                    break;

                case "seasonnumber":
                    dto.SeasonNumber = int.Parse(value);
                    break;
                case "episodenumber":
                    dto.EpisodeNumber = int.Parse(value);
                    break;
                case "title":
                    dto.Title = value;
                    break;

                case "description":
                    dto.Description = value;
                    break;

                case "agegroup":
                    dto.AgeGroup = int.Parse(value);
                    break;

                case "imdbrating":
                    dto.ImdbRating = decimal.Parse(value);
                    break;
                case "rating":
                    dto.Rating = decimal.Parse(value);
                    break;
                case "publisheddate":
                    dto.PublishedDate = int.Parse(value);
                    break;

                case "genres":
                    dto.Genres = JsonSerializer.Deserialize<List<string>>(value);
                    break;

                case "directors":
                    dto.Directors = JsonSerializer.Deserialize<List<string>>(value);
                    break;

                case "writers":
                    dto.Writers = JsonSerializer.Deserialize<List<string>>(value);
                    break;

                case "actors":
                    dto.Actors= JsonSerializer.Deserialize<List<string>>(value);
                    break;
                case "languages":
                    dto.Languages = JsonSerializer.Deserialize<List<string>>(value);
                    break;

                case "countries":
                    dto.Countries = JsonSerializer.Deserialize<List<string>>(value);
                    break;
                case "city":
                    dto.City = value;
                    break;
                case "country":
                    dto.Country = value;
                    break;

            }
        }


    }
}
