namespace EntertainmentApp.Infrastructure.Downloaders
{
    public class MovieDownloader : IMediaDownloader
    {
        public MediaType Type => MediaType.Movie;
        private readonly IMovieRepository _repo;
        private readonly IMediaService _mediaService;
        private readonly IConfiguration _configuration;
        private readonly IDownloadProgressNotifier _progressNotifier;
        private readonly ILogger<MovieDownloader> _logger;


        public MovieDownloader(IMovieRepository repo, 
            IMediaService mediaService, 
            IConfiguration configuration, 
            IDownloadProgressNotifier progressNotifier, 
            ILogger<MovieDownloader> logger)
        {
            _repo = repo;
            _mediaService = mediaService;
            _configuration = configuration;
            _progressNotifier = progressNotifier;
            _logger = logger;
        }
        public async Task DownloadAsync(Guid id, CancellationToken ct)
        {
            var movie = await _repo.GetMovieByIdAsync(id);
            if (movie == null) return;

            movie.ChangeDownloadStatus(DownloadStatus.Downloading);
            movie.ChangeCurrentlyDownload(true);
            await _repo.UpdateMovieAsync(movie);
            try
            {
                await DownloadMovieAsync(movie, ct);

                movie.ChangeDownloadStatus(DownloadStatus.Completed);
                movie.ChangeCurrentlyDownload(false);
            }
            catch  (Exception ex)
            {
                movie.ChangeDownloadStatus(DownloadStatus.Failed);
                movie.SetDownloadErrorMessage(ex.Message);
                _logger.LogError($"###### error in downloading movie:  {movie.Id}");
                await _progressNotifier.ReportAsync(new DownloadProgress
                {
                    Id = id,
                    MediaType = MediaType.Movie.ToString(),
                    FileType = "Stream",
                    //EpisodeId = movie.Id,
                    Percentage = 100,
                    DownloadedBytes = 0,
                    TotalBytes = 0,
                    Status = DownloadStatus.Failed,
                    ErrorMessage = ex.Message
                });

            }
            await _repo.UpdateMovieAsync(movie);
        }

        private async Task DownloadMovieAsync(Movie movie, CancellationToken ct)
        {
            string directoryPath = Path.Combine(_configuration["BaseStoragePath"], Path.GetDirectoryName(movie.PosterImageUrl));

            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);

            // VIDEO
            string streamPath = Path.Combine(directoryPath, Path.GetFileName(movie.StreamUrl));
            await _mediaService.DownloadFile(movie.StreamUrl, streamPath, ct, movie.Id, MediaType.Movie);

            // POSTER
            string posterPath = Path.Combine(directoryPath, Path.GetFileName(movie.PosterImageUrl));
            await _mediaService.DownloadFile(movie.PosterImageUrl, posterPath, ct, movie.Id, MediaType.Movie);

            // SUBTITLE (optional)
            if (!string.IsNullOrWhiteSpace(movie.SubtitleUrl))
            {
                string subtitlePath = Path.Combine(directoryPath, Path.GetFileName(movie.SubtitleUrl));
                await _mediaService.DownloadFile(movie.SubtitleUrl, subtitlePath, ct, movie.Id, MediaType.Movie);

                movie.SetSubtitleUrl(subtitlePath);
            }

            // Update to LOCAL paths
            //movie.SetStreamUrl(streamPath);
            //movie.SetPosterImageUrl(posterPath);
        }


        //private async Task DownloadFile(string url, string path, CancellationToken ct, Guid id, MediaType type, Guid? episodeId = null)
        //{
        //    url = url.TrimStart('/');
        //    //.Replace("\\", "/");

        //    long existingLength = 0;
        //    if (File.Exists(path))
        //    {
        //        existingLength = new FileInfo(path).Length;
        //    }
        //    var request = new HttpRequestMessage(HttpMethod.Get, $"media/{url}");
        //    if (existingLength > 0)
        //    {
        //        request.Headers.Range = new System.Net.Http.Headers.RangeHeaderValue(existingLength, null);
        //    }
        //    var response = await _serverClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);

        //    // ❗ If server ignored range → restart
        //    if (response.StatusCode == System.Net.HttpStatusCode.OK && existingLength > 0)
        //    {
        //        existingLength = 0;
        //    }

        //    response.EnsureSuccessStatusCode();

        //    var totalBytes = response.Content.Headers.ContentLength ?? 0;
        //    var totalToDownload = totalBytes + existingLength;

        //    await using var stream = await response.Content.ReadAsStreamAsync(ct);

        //    await using var fileStream = new FileStream(
        //        path,
        //        existingLength > 0 ? FileMode.Append : FileMode.Create,
        //        FileAccess.Write,
        //        FileShare.None);



        //    if (!ValidExtensionList.VideoExtension.Contains(Path.GetExtension(path), StringComparer.OrdinalIgnoreCase))
        //    {
        //        await stream.CopyToAsync(fileStream, ct);
        //        //send message with signalr that this file downloaded.
        //        if (ValidExtensionList.ImageExtension.Contains(Path.GetExtension(path), StringComparer.OrdinalIgnoreCase))
        //            await _progressNotifier.ReportAsync(new DownloadProgress
        //            {
        //                Id = id,
        //                MediaType = type,
        //                FileType = "PosterImage",
        //                Percentage = 100,
        //                DownloadedBytes = totalToDownload,
        //                TotalBytes = totalToDownload
        //            });
        //        if (ValidExtensionList.SubtitleExtension.Contains(Path.GetExtension(path), StringComparer.OrdinalIgnoreCase))
        //            await _progressNotifier.ReportAsync(new DownloadProgress
        //            {
        //                Id = id,
        //                MediaType = type,
        //                FileType = "Subtitle",
        //                Percentage = 100,
        //                DownloadedBytes = totalToDownload,
        //                TotalBytes = totalToDownload
        //            });
        //        return;
        //    }

        //    var buffer = new byte[81920];
        //    long totalRead = existingLength;
        //    int read;
        //    var lastReportTime = DateTime.UtcNow;
        //    while ((read = await stream.ReadAsync(buffer, 0, buffer.Length, ct)) > 0)
        //    {
        //        await fileStream.WriteAsync(buffer, 0, read, ct);

        //        totalRead += read;

        //        double percentage = totalToDownload == 0
        //            ? 0
        //            : (double)totalRead / totalToDownload * 100;

        //        if ((DateTime.UtcNow - lastReportTime).TotalMilliseconds > 500)
        //        {
        //            Console.WriteLine("+++++++++++++++++++++++++++++ progress ");
        //            await _progressNotifier.ReportAsync(new DownloadProgress
        //            {
        //                Id = id,
        //                MediaType = type,
        //                FileType = "Stream",
        //                EpisodeId = episodeId,
        //                Percentage = percentage,
        //                DownloadedBytes = totalRead,
        //                TotalBytes = totalToDownload
        //            });
        //            lastReportTime = DateTime.UtcNow;
        //        }
        //    }
        //    await _progressNotifier.ReportAsync(new DownloadProgress
        //    {
        //        Id = id,
        //        MediaType = type,
        //        FileType = "Stream",
        //        EpisodeId = episodeId,
        //        Percentage = 100,
        //        DownloadedBytes = totalRead,
        //        TotalBytes = totalToDownload
        //    });

        //}


    }
}
