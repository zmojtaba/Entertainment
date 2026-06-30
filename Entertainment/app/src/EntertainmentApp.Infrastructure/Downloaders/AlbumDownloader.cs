namespace EntertainmentApp.Infrastructure.Downloaders
{
    public class AlbumDownloader : IMediaDownloader
    {
        public MediaType Type => MediaType.Album;
        private readonly IMusicRepository _repo;
        private readonly IMediaService _mediaService;
        private readonly IConfiguration _configuration;
        private readonly IDownloadProgressNotifier _progressNotifier;
        private readonly ILogger<AlbumDownloader> _logger;


        public AlbumDownloader(IMusicRepository repo,
            IMediaService mediaService,
            IConfiguration configuration,
            IDownloadProgressNotifier progressNotifier,
            ILogger<AlbumDownloader> logger)
        {
            _repo = repo;
            _mediaService = mediaService;
            _configuration = configuration;
            _progressNotifier = progressNotifier;
            _logger = logger;
        }

        public async Task DownloadAsync(Guid episodeId, CancellationToken ct)
        {
            Album series = await _repo.GetAlbumByEpisodeIdAsync(episodeId);
            if (series == null) return;
            AlbumEpisode episode = series.Episodes.FirstOrDefault(ep => ep.Id == episodeId);
            episode.ChangeDownloadStatus(DownloadStatus.Downloading);
            episode.ChangeCurrentlyDownload(true);
            //await _repo.UpdateEpisodeAsync(episode);
            series.ChangeDownloadStatus(DownloadStatus.Downloading);
            series.ChangeCurrentlyDownload(true);

            await _repo.UpdateAlbumAsync(series);
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
                _logger.LogError($"###### error in downloading Album episode: {episode.Id}");
                await _progressNotifier.ReportAsync(new DownloadProgress
                {
                    //Id = series.Id,
                    Id = episode.Id,
                    MediaType = MediaType.Album.ToString(),
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
            await _repo.UpdateAlbumAsync(series);
        }
        private bool IsSeriesDownloaded(Album series)
        {
            return series.Episodes.All(e => e.DownloadStatus == DownloadStatus.Completed);
        }
        private async Task DownloadSeriesAsync(Album series, AlbumEpisode episode, CancellationToken ct)
        {
            string directoryPath = Path.Combine(_configuration["BaseStoragePath"], Path.GetDirectoryName(series.PosterImageUrl));

            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);

            string posterPath = Path.Combine(directoryPath, Path.GetFileName(series.PosterImageUrl));
            await _mediaService.DownloadFile(series.PosterImageUrl, posterPath, ct, series.Id, MediaType.Album);

            string streamPath = Path.Combine(directoryPath, Path.GetFileName(episode.StreamUrl));
            await _mediaService.DownloadFile(episode.StreamUrl, streamPath, ct, episode.Id, MediaType.Album);


        }
    }
}
