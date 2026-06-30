namespace EntertainmentApp.Infrastructure.Downloaders
{
    public class SeriesDownloader : IMediaDownloader
    {
        private readonly ISeriesRepository _repo;
        private readonly IConfiguration _configuration;
        private readonly IMediaService _mediaService;
        private readonly ILogger<SeriesDownloader> _logger;
        private readonly IDownloadProgressNotifier _progressNotifier;

        public SeriesDownloader(ISeriesRepository repo,
            IMediaService mediaService,
            IConfiguration configuration,
            IDownloadQueue queue,
            ILogger<SeriesDownloader> logger,
            IDownloadProgressNotifier progressNotifier)
        {
            _repo = repo;
            _mediaService = mediaService;
            _configuration = configuration;
            _logger = logger;
            _progressNotifier = progressNotifier;
        }

        public MediaType Type => MediaType.Series;

        public async Task DownloadAsync(Guid episodeId, CancellationToken ct)
        {
            Series series = await _repo.GetSeriesByEpisodeIdAsync(episodeId);
            if (series == null ) return;
            Episode episode = series.Seasons.SelectMany(s => s.Episodes).FirstOrDefault(ep => ep.Id == episodeId);
            //if (episode == null ) return;
            episode.ChangeDownloadStatus(DownloadStatus.Downloading);
            episode.ChangeCurrentlyDownload(true);
            //await _repo.UpdateEpisodeAsync(episode);
            series.ChangeDownloadStatus(DownloadStatus.Downloading);
            series.ChangeCurrentlyDownload(true);

            await _repo.UpdateSeriesAsync(series);
            try
            {
                await DownloadSeriesAsync(series, episode, ct);
                episode.ChangeDownloadStatus(DownloadStatus.Completed);
                series.ChangeCurrentlyDownload(false);
                episode.ChangeCurrentlyDownload(false);
            }
            catch (Exception ex) 
            {
               
                episode.ChangeDownloadStatus(DownloadStatus.Failed);
                series.ChangeDownloadStatus(DownloadStatus.Failed);
                _logger.LogError($"###### error in downloading series episode: {episode.Id}");
                await _progressNotifier.ReportAsync(new DownloadProgress
                {
                    //Id = series.Id,
                    Id = episode.Id,
                    MediaType = MediaType.Series.ToString(),
                    FileType = "Stream",
                    //EpisodeId = episode.Id,
                    Percentage = 100,
                    DownloadedBytes = 0,
                    TotalBytes = 0,
                    Status = DownloadStatus.Failed,
                    ErrorMessage = ex.Message
                });

            }
            if (IsSeriesDownloaded(series)) 
                series.ChangeDownloadStatus(DownloadStatus.Completed);
            else
                series.ChangeDownloadStatus(DownloadStatus.InQueue);
            await _repo.UpdateSeriesAsync(series);
        }
        private bool IsSeriesDownloaded(Series series)
        {
            return series.Seasons.All(s => s.Episodes.All(e => e.DownloadStatus == DownloadStatus.Completed));
        }
        private async Task DownloadSeriesAsync(Series series, Episode episode, CancellationToken ct)
        {
            string directoryPath = Path.Combine(_configuration["BaseStoragePath"], Path.GetDirectoryName(series.PosterImageUrl));

            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);

            string posterPath = Path.Combine(directoryPath, Path.GetFileName(series.PosterImageUrl));
            await _mediaService.DownloadFile(series.PosterImageUrl, posterPath, ct, series.Id, MediaType.Series);
            // VIDEO
            string streamPath = Path.Combine(directoryPath, Path.GetFileName(episode.StreamUrl));
            await _mediaService.DownloadFile(episode.StreamUrl, streamPath, ct, episode.Id, MediaType.Series);

            // POSTER

            // SUBTITLE (optional)
            if (!string.IsNullOrWhiteSpace(episode.SubtitleUrl))
            {
                string subtitlePath = Path.Combine(directoryPath, Path.GetFileName(episode.SubtitleUrl));
                await _mediaService.DownloadFile(episode.SubtitleUrl, subtitlePath, ct, episode.Id, MediaType.Series);
            }

        }



    }
}
