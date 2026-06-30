namespace EntertainmentApp.Infrastructure.Downloaders
{
    public class NewsPaperDownloader : IMediaDownloader
    {
        public MediaType Type => MediaType.NewsPaper;
        private readonly IPublicationRepository _repo;
        private readonly IMediaService _mediaService;
        private readonly IConfiguration _configuration;
        private readonly IDownloadProgressNotifier _progressNotifier;
        private readonly ILogger<NewsPaperDownloader> _logger;


        public NewsPaperDownloader(IPublicationRepository repo,
            IMediaService mediaService,
            IConfiguration configuration,
            IDownloadProgressNotifier progressNotifier,
            ILogger<NewsPaperDownloader> logger)
        {
            _repo = repo;
            _mediaService = mediaService;
            _configuration = configuration;
            _progressNotifier = progressNotifier;
            _logger = logger;
        }


        public async Task DownloadAsync(Guid id, CancellationToken ct)
        {
            NewsPaper entity = await _repo.GetNewsPaperByIdAsync(id);
            if (entity == null) return;

            entity.ChangeDownloadStatus(DownloadStatus.Downloading);
            entity.ChangeCurrentlyDownload(true);
            await _repo.UpdateNewsPaperAsync(entity);
            try
            {
                await DownloadNewsPaperAsync(entity, ct);

                entity.ChangeDownloadStatus(DownloadStatus.Completed);
                entity.ChangeCurrentlyDownload(false);
            }
            catch (Exception ex)
            {
                entity.ChangeDownloadStatus(DownloadStatus.Failed);
                entity.SetDownloadErrorMessage(ex.Message);
                _logger.LogError($"###### error in downloading NewsPaper:  {entity.Id}");
                await _progressNotifier.ReportAsync(new DownloadProgress
                {
                    Id = id,
                    MediaType = MediaType.NewsPaper.ToString(),
                    FileType = "Stream",
                    //EpisodeId = entity.Id,
                    Percentage = 100,
                    DownloadedBytes = 0,
                    TotalBytes = 0,
                    Status = DownloadStatus.Failed,
                    ErrorMessage = ex.Message
                });

            }
            await _repo.UpdateNewsPaperAsync(entity);
        }

        private async Task DownloadNewsPaperAsync(NewsPaper entity, CancellationToken ct)
        {
            string directoryPath = Path.Combine(_configuration["BaseStoragePath"], Path.GetDirectoryName(entity.PosterImageUrl));

            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);

            // VIDEO
            string streamPath = Path.Combine(directoryPath, Path.GetFileName(entity.StreamUrl));
            await _mediaService.DownloadFile(entity.StreamUrl, streamPath, ct, entity.Id, MediaType.NewsPaper);

            // POSTER
            string posterPath = Path.Combine(directoryPath, Path.GetFileName(entity.PosterImageUrl));
            await _mediaService.DownloadFile(entity.PosterImageUrl, posterPath, ct, entity.Id, MediaType.NewsPaper);

        }


    }
}
