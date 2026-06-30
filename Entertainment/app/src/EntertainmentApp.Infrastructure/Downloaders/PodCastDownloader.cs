namespace EntertainmentApp.Infrastructure.Downloaders
{
    public class PodCastDownloader : IMediaDownloader
    {
        public MediaType Type => MediaType.PodCast;
        private readonly IStoryRepository _repo;
        private readonly IMediaService _mediaService;
        private readonly IConfiguration _configuration;
        private readonly IDownloadProgressNotifier _progressNotifier;
        private readonly ILogger<PodCastDownloader> _logger;


        public PodCastDownloader(IStoryRepository repo,
            IMediaService mediaService,
            IConfiguration configuration,
            IDownloadProgressNotifier progressNotifier,
            ILogger<PodCastDownloader> logger)
        {
            _repo = repo;
            _mediaService = mediaService;
            _configuration = configuration;
            _progressNotifier = progressNotifier;
            _logger = logger;
        }

        public async Task DownloadAsync(Guid episodeId, CancellationToken ct)
        {
            PodCast series = await _repo.GetPodCastByEpisodeIdAsync(episodeId);
            if (series == null) return;
            PodCastEpisode episode = series.Episodes.FirstOrDefault(ep => ep.Id == episodeId);
            episode.ChangeDownloadStatus(DownloadStatus.Downloading);
            episode.ChangeCurrentlyDownload(true);
            //await _repo.UpdateEpisodeAsync(episode);
            series.ChangeDownloadStatus(DownloadStatus.Downloading);
            series.ChangeCurrentlyDownload(true);

            await _repo.UpdatePodCastAsync(series);
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
                _logger.LogError($"###### error in downloading PodCast episode: {episode.Id}");
                await _progressNotifier.ReportAsync(new DownloadProgress
                {
                    //Id = series.Id,
                    Id = episode.Id,
                    MediaType = MediaType.PodCast.ToString(),
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
            await _repo.UpdatePodCastAsync(series);
        }
        private bool IsSeriesDownloaded(PodCast series)
        {
            return series.Episodes.All(e => e.DownloadStatus == DownloadStatus.Completed);
        }
        private async Task DownloadSeriesAsync(PodCast series, PodCastEpisode episode, CancellationToken ct)
        {
            string directoryPath = Path.Combine(_configuration["BaseStoragePath"], Path.GetDirectoryName(series.PosterImageUrl));

            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);

            string posterPath = Path.Combine(directoryPath, Path.GetFileName(series.PosterImageUrl));
            await _mediaService.DownloadFile(series.PosterImageUrl, posterPath, ct, series.Id, MediaType.AudioStory);

            string streamPath = Path.Combine(directoryPath, Path.GetFileName(episode.StreamUrl));
            await _mediaService.DownloadFile(episode.StreamUrl, streamPath, ct, episode.Id, MediaType.AudioStory);


        }

    }
}
