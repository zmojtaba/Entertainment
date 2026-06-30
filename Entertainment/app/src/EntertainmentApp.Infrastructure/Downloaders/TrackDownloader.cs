namespace EntertainmentApp.Infrastructure.Downloaders
{
    public class TrackDownloader : IMediaDownloader
    {
        public MediaType Type => MediaType.Track;
        private readonly IMusicRepository _repo;
        private readonly IMediaService _mediaService;
        private readonly IConfiguration _configuration;
        private readonly IDownloadProgressNotifier _progressNotifier;
        private readonly ILogger<TrackDownloader> _logger;


        public TrackDownloader(IMusicRepository repo,
            IMediaService mediaService,
            IConfiguration configuration,
            IDownloadProgressNotifier progressNotifier,
            ILogger<TrackDownloader> logger)
        {
            _repo = repo;
            _mediaService = mediaService;
            _configuration = configuration;
            _progressNotifier = progressNotifier;
            _logger = logger;
        }
        public async Task DownloadAsync(Guid id, CancellationToken ct)
        {
            var entity = await _repo.GetTrackByIdAsync(id);
            if (entity == null) return;

            entity.ChangeDownloadStatus(DownloadStatus.Downloading);
            entity.ChangeCurrentlyDownload(true);
            await _repo.UpdateTrackAsync(entity);
            try
            {
                await DownloadTrackAsync(entity, ct);

                entity.ChangeDownloadStatus(DownloadStatus.Completed);
                entity.ChangeCurrentlyDownload(false);
            }
            catch (Exception ex)
            {
                entity.ChangeDownloadStatus(DownloadStatus.Failed);
                entity.SetDownloadErrorMessage(ex.Message);
                _logger.LogError($"###### error in downloading track:  {entity.Id}");
                await _progressNotifier.ReportAsync(new DownloadProgress
                {
                    Id = id,
                    MediaType = MediaType.Track.ToString(),
                    FileType = "Stream",
                    //EpisodeId = entity.Id,
                    Percentage = 100,
                    DownloadedBytes = 0,
                    TotalBytes = 0,
                    Status = DownloadStatus.Failed,
                    ErrorMessage = ex.Message
                });

            }
            await _repo.UpdateTrackAsync(entity);
        }

        private async Task DownloadTrackAsync(Track entity, CancellationToken ct)
        {
            string directoryPath = Path.Combine(_configuration["BaseStoragePath"], Path.GetDirectoryName(entity.PosterImageUrl));

            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);

            // VIDEO
            string streamPath = Path.Combine(directoryPath, Path.GetFileName(entity.StreamUrl));
            await _mediaService.DownloadFile(entity.StreamUrl, streamPath, ct, entity.Id, MediaType.Track);

            // POSTER
            string posterPath = Path.Combine(directoryPath, Path.GetFileName(entity.PosterImageUrl));
            await _mediaService.DownloadFile(entity.PosterImageUrl, posterPath, ct, entity.Id, MediaType.Track);
        }
    }
}
