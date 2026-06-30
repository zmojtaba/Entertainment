using System.Net;

namespace EntertainmentApp.Infrastructure.Services
{
    public class MediaService : IMediaService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _serverClient;
        private readonly IDownloadProgressNotifier _progressNotifier;
        public MediaService(IConfiguration configuration, HttpClient httpClient, IHttpClientFactory factory, IDownloadProgressNotifier progressNotifier)
        {
            _configuration = configuration;
            _serverClient = factory.CreateClient("MediaApi");
            _progressNotifier = progressNotifier;
        }

        public async Task<MediaUploadResult> UploadAsync(Stream bodyStream, string contentType)
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

            string subtitlePath = null;
            string subtitleFileName = null;

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

                    if (!Directory.Exists(tempPath)) Directory.CreateDirectory(tempPath);
                    fileName = Guid.NewGuid().ToString("N") + "_" + fileName;
                    string storagePath = Path.Combine(tempPath, fileName);

                    if (name.Equals("video", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!IsValidExtension(fileName, "video"))
                        {
                            //if (File.Exists(posterPath)) File.Delete(posterPath);
                            await DeleteFileAsync(subtitlePath);
                            await DeleteFileAsync(posterPath);
                            throw new BadRequestException($"Invalid video file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.VideoExtension)}");
                        }

                        streamPath = storagePath;
                        streamFileName = fileName;
                    }
                    if (name.Equals("audio", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!IsValidExtension(fileName, "audio"))
                        {
                            //if (File.Exists(posterPath)) File.Delete(posterPath);
                            await DeleteFileAsync(posterPath);
                            throw new BadRequestException($"Invalid Audio file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.AudioExtension)}");
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
                        if (!IsValidExtension(fileName, "audio"))
                        {
                            if (File.Exists(posterPath)) File.Delete(posterPath);
                            throw new BadRequestException($"Invalid audio file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.AudioExtension)}");
                        }

                        streamPath = storagePath;
                        streamFileName = fileName;
                    }
                    if (name.Equals("subtitle", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!IsValidExtension(fileName, "subtitle"))
                        {
                            //if (File.Exists(subtitlePath)) File.Delete(posterPath);
                            await DeleteFileAsync(posterPath);
                            await DeleteFileAsync(streamPath);
                            throw new BadRequestException($"Invalid subtitle file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.SubtitleExtension)}");
                        }

                        subtitlePath = storagePath;
                        subtitleFileName = fileName;
                    }

                    else if (name.Equals("poster", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!IsValidExtension(fileName, "image"))
                        {
                            if (File.Exists(streamPath)) File.Delete(streamPath);
                            await DeleteFileAsync(subtitlePath);
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
                    try
                    {
                        MapToDto(mediaUploadResult, key, value);
                    }
                    catch (Exception ex)
                    {
                        if (!string.IsNullOrEmpty(streamPath)) DeleteFileAsync(streamPath);
                        if (!string.IsNullOrEmpty(posterPath)) DeleteFileAsync(posterPath);
                        throw new BadRequestException(ex.Message);
                    }
                }
            }
            //if (posterPath == null)
            //    throw new BadRequestException("Poster Image file required.");

            if (streamPath == null)
                throw new BadRequestException("Media file is required.");

            mediaUploadResult.TempStreamUrl = streamPath;
            mediaUploadResult.TempPosterImageUrl = posterPath;
            mediaUploadResult.TempSubtitleUrl = subtitlePath;
            mediaUploadResult.StreamFileName = streamFileName;
            mediaUploadResult.PosterImageFileName = posterFileName;
            mediaUploadResult.TempSubtitleFileName = subtitleFileName;
            return mediaUploadResult;


        }

        public async Task<string> UploadPosterImage(IFormFile file)
        {

            if (!IsValidExtension(file.FileName, "image"))
                throw new BadRequestException($"Poster Image is not valid. valid format: {string.Join(", ", ValidExtensionList.ImageExtension)}");

            byte[] imageBytes;



            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                imageBytes = memoryStream.ToArray();
            }
            string imageName = Guid.NewGuid() + "_" + file.FileName;
            string tempPath = Path.Combine(_configuration["BaseStoragePath"], "temp", imageName);
            File.WriteAllBytes(tempPath, imageBytes);
            return tempPath;
        }

        public Task DeleteFileAsync(string fileUrl, bool addBaseAddress = false)
        {
            if (string.IsNullOrEmpty(fileUrl)) return Task.CompletedTask;
            if (addBaseAddress)
            {
                fileUrl = Path.Combine(_configuration["BaseStoragePath"], fileUrl);
            }
            // delete file from disk / cloud storage
            if (File.Exists(fileUrl)) File.Delete(fileUrl);
            return Task.CompletedTask;
        }

        public Task DeleteMediaDirecoryAsync(string mediaDirectory, bool addBaseAddress = false)
        {
            if (addBaseAddress) mediaDirectory = Path.Combine(_configuration["BaseStoragePath"], mediaDirectory);
            if (Directory.Exists(mediaDirectory)) Directory.Delete(mediaDirectory, recursive: true);
            return Task.CompletedTask;
        }



        public Task<string> MoveMediaDirectory(string sourceDir, string title, string category, string subcategory, bool addBaseAddress = false)
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
            if (category.Equals("publication", StringComparison.OrdinalIgnoreCase))
            {
                TitlePath = CleanFileName(title);
            }
            return Path.Combine(category, subcategory, TitlePath);

        }

        private static bool IsValidExtension(string fileName, string category)
        {
            string extension = Path.GetExtension(fileName);
            if (category.Equals("video", StringComparison.OrdinalIgnoreCase))
                return ValidExtensionList.VideoExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);
            if (category.Equals("subtitle", StringComparison.OrdinalIgnoreCase))
                return ValidExtensionList.SubtitleExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);
            if (category.Equals("audio", StringComparison.OrdinalIgnoreCase))
                return ValidExtensionList.AudioExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);
            if (category.Equals("image", StringComparison.OrdinalIgnoreCase))
                return ValidExtensionList.ImageExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);
            if (category.Equals("ebook", StringComparison.OrdinalIgnoreCase))
                return ValidExtensionList.BookExtension.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                    ValidExtensionList.AudioExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);
            return false;

        }

        private static bool IsValidExtension(string extension)
        {
            if (
                ValidExtensionList.BookExtension.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                ValidExtensionList.AudioExtension.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                ValidExtensionList.VideoExtension.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                ValidExtensionList.SubtitleExtension.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
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
                    bool validId = Guid.TryParse(value, out Guid seriesId);
                    if (!validId) throw new BadRequestException("Id is not Valid");
                    dto.SeriesId = seriesId;
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
                    if (!long.TryParse(value, out long number))
                        break;

                    int digitCount = Math.Abs(number).ToString().Length;

                    if (digitCount > 4)
                    {
                        dto.PublishedTime = number;
                    }
                    else
                    {
                        dto.PublishedDate = (int)number;
                    }

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

                case "singer":
                    dto.Singer = value;
                    break;

                case "publisher":
                    dto.Publisher = value;
                    break;
                case "actors":
                    dto.Actors = JsonSerializer.Deserialize<List<string>>(value);
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




        public async Task DownloadFile(string url, string path, CancellationToken ct, Guid id, MediaType type)
        {
            url = url.TrimStart('/');
            //.Replace("\\", "/");

            var extension = Path.GetExtension(path);

            bool isImage = ValidExtensionList.ImageExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);
            bool isSubtitle = ValidExtensionList.SubtitleExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);
            bool isVideo = ValidExtensionList.VideoExtension.Contains(extension, StringComparer.OrdinalIgnoreCase);

            // ================= IMAGE / SUBTITLE =================
            if (isImage || isSubtitle)
            {
                if (File.Exists(path) && IsFileValid(path))
                {
                    return;
                }

                // always overwrite corrupted or missing file
                var request = new HttpRequestMessage(HttpMethod.Get, $"media/{url}");
                var response = await _serverClient.SendAsync(request, ct);
                response.EnsureSuccessStatusCode();

                await using var stream = await response.Content.ReadAsStreamAsync(ct);
                await using var fileStream = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None);

                await stream.CopyToAsync(fileStream, ct);

                await _progressNotifier.ReportAsync(new DownloadProgress
                {
                    Id = id,
                    MediaType = type.ToString(),
                    FileType = isImage ? "PosterImage" : "Subtitle",
                    Percentage = 100,
                    DownloadedBytes = new FileInfo(path).Length,
                    TotalBytes = new FileInfo(path).Length
                });

                return;
            }

            // ================= VIDEO (RESUMABLE) =================
            long existingLength = 0;
            if (File.Exists(path))
            {
                existingLength = new FileInfo(path).Length;
            }
            var requestVideo = new HttpRequestMessage(HttpMethod.Get, $"media/{url}");
            if (existingLength > 0)
            {
                requestVideo.Headers.Range = new System.Net.Http.Headers.RangeHeaderValue(existingLength, null);
            }
            var responseVideo = await _serverClient.SendAsync(requestVideo, HttpCompletionOption.ResponseHeadersRead, ct);

            if (responseVideo.StatusCode == HttpStatusCode.RequestedRangeNotSatisfiable)
            {
                var serverSize = responseVideo.Content.Headers.ContentRange?.Length;
                var localSize = new FileInfo(path).Length;

                if (serverSize.HasValue && serverSize.Value == localSize)
                {
                    await _progressNotifier.ReportAsync(new DownloadProgress
                    {
                        Id = id,
                        MediaType = type.ToString(),
                        FileType = "Stream",
                        //EpisodeId = episodeId,
                        Percentage = 100,
                        DownloadedBytes = localSize,
                        TotalBytes = localSize
                    });

                    return;
                }

                // ❗ mismatch → file is corrupted → restart download
                existingLength = 0;
                await DeleteFileAsync(path);
            }

            // ❗ If server ignored range → restart
            if (responseVideo.StatusCode == System.Net.HttpStatusCode.OK && existingLength > 0)
            {
                existingLength = 0;
            }

            responseVideo.EnsureSuccessStatusCode();

            var totalBytes = responseVideo.Content.Headers.ContentLength ?? 0;
            var totalToDownload = totalBytes + existingLength;

            await using var streamVideo = await responseVideo.Content.ReadAsStreamAsync(ct);

            await using var fileStreamVideo = new FileStream(
                path,
                existingLength > 0 ? FileMode.Append : FileMode.Create,
                FileAccess.Write,
                FileShare.None);


            var buffer = new byte[81920];
            long totalRead = existingLength;
            int read;
            var lastReportTime = DateTime.UtcNow;
            while ((read = await streamVideo.ReadAsync(buffer, 0, buffer.Length, ct)) > 0)
            {
                await fileStreamVideo.WriteAsync(buffer, 0, read, ct);

                totalRead += read;

                double percentage = totalToDownload == 0
                    ? 0
                    : (double)totalRead / totalToDownload * 100;

                if ((DateTime.UtcNow - lastReportTime).TotalMilliseconds > 500)
                {
                    Console.WriteLine("+++++++++++++++++++++++++++++ progress ");
                    await _progressNotifier.ReportAsync(new DownloadProgress
                    {
                        Id = id,
                        MediaType = type.ToString(),
                        FileType = "Stream",
                        //EpisodeId = episodeId,
                        Percentage = percentage,
                        DownloadedBytes = totalRead,
                        TotalBytes = totalToDownload
                    });
                    lastReportTime = DateTime.UtcNow;
                }
            }
            await _progressNotifier.ReportAsync(new DownloadProgress
            {
                Id = id,
                MediaType = type.ToString(),
                FileType = "Stream",
                //EpisodeId = episodeId,
                Percentage = 100,
                DownloadedBytes = totalRead,
                TotalBytes = totalToDownload
            });

        }


        private bool IsFileValid(string path)
        {
            try
            {
                var fileInfo = new FileInfo(path);
                if (fileInfo.Length == 0)
                    return false;

                // try open file (detect corruption)
                using var stream = File.OpenRead(path);
                return true;
            }
            catch
            {
                return false;
            }
        }

    }
}