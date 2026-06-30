namespace EntertainmentApp.Infrastructure.Downloaders
{
    public class AudioStoryDownloader : IMediaDownloader
    {
        public MediaType Type => MediaType.AudioStory;
        private readonly IStoryRepository _repo;
        private readonly IMediaService _mediaService;
        private readonly IConfiguration _configuration;
        private readonly IDownloadProgressNotifier _progressNotifier;
        private readonly ILogger<AudioStoryDownloader> _logger;


        public AudioStoryDownloader(IStoryRepository repo,
            IMediaService mediaService,
            IConfiguration configuration,
            IDownloadProgressNotifier progressNotifier,
            ILogger<AudioStoryDownloader> logger)
        {
            _repo = repo;
            _mediaService = mediaService;
            _configuration = configuration;
            _progressNotifier = progressNotifier;
            _logger = logger;
        }

        public async Task DownloadAsync(Guid episodeId, CancellationToken ct)
        {
            AudioStory series = await _repo.GetAudioStoryByEpisodeIdAsync(episodeId);
            if (series == null) return;
            AudioStoryEpisode episode = series.Episodes.FirstOrDefault(ep => ep.Id == episodeId);
            episode.ChangeDownloadStatus(DownloadStatus.Downloading);
            episode.ChangeCurrentlyDownload(true);
            //await _repo.UpdateEpisodeAsync(episode);
            series.ChangeDownloadStatus(DownloadStatus.Downloading);
            series.ChangeCurrentlyDownload(true);

            await _repo.UpdateAudioStoryAsync(series);
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
                _logger.LogError($"###### error in downloading AudioStory episode: {episode.Id}");
                await _progressNotifier.ReportAsync(new DownloadProgress
                {
                    //Id = series.Id,
                    Id = episode.Id,
                    MediaType = MediaType.AudioStory.ToString(),
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
            await _repo.UpdateAudioStoryAsync(series);
        }
        private bool IsSeriesDownloaded(AudioStory series)
        {
            return series.Episodes.All(e => e.DownloadStatus == DownloadStatus.Completed);
        }
        private async Task DownloadSeriesAsync(AudioStory series, AudioStoryEpisode episode, CancellationToken ct)
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
