namespace EntertainmentApp.Infrastructure.Downloaders
{
    public class MagazineDownloader : IMediaDownloader
    {
        public MediaType Type => MediaType.Magazine;
        private readonly IPublicationRepository _repo;
        private readonly IMediaService _mediaService;
        private readonly IConfiguration _configuration;
        private readonly IDownloadProgressNotifier _progressNotifier;
        private readonly ILogger<MagazineDownloader> _logger;


        public MagazineDownloader(IPublicationRepository repo,
            IMediaService mediaService,
            IConfiguration configuration,
            IDownloadProgressNotifier progressNotifier,
            ILogger<MagazineDownloader> logger)
        {
            _repo = repo;
            _mediaService = mediaService;
            _configuration = configuration;
            _progressNotifier = progressNotifier;
            _logger = logger;
        }


        public async Task DownloadAsync(Guid id, CancellationToken ct)
        {
            Magazine entity = await _repo.GetMagazineByIdAsync(id);
            if (entity == null) return;

            entity.ChangeDownloadStatus(DownloadStatus.Downloading);
            entity.ChangeCurrentlyDownload(true);
            await _repo.UpdateMagazineAsync(entity);
            try
            {
                await DownloadMagazineAsync(entity, ct);

                entity.ChangeDownloadStatus(DownloadStatus.Completed);
                entity.ChangeCurrentlyDownload(false);
            }
            catch (Exception ex)
            {
                entity.ChangeDownloadStatus(DownloadStatus.Failed);
                entity.SetDownloadErrorMessage(ex.Message);
                _logger.LogError($"###### error in downloading Magazine:  {entity.Id}");
                await _progressNotifier.ReportAsync(new DownloadProgress
                {
                    Id = id,
                    MediaType = MediaType.Magazine.ToString(),
                    FileType = "Stream",
                    //EpisodeId = entity.Id,
                    Percentage = 100,
                    DownloadedBytes = 0,
                    TotalBytes = 0,
                    Status = DownloadStatus.Failed,
                    ErrorMessage = ex.Message
                });

            }
            await _repo.UpdateMagazineAsync(entity);
        }

        private async Task DownloadMagazineAsync(Magazine entity, CancellationToken ct)
        {
            string directoryPath = Path.Combine(_configuration["BaseStoragePath"], Path.GetDirectoryName(entity.PosterImageUrl));

            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);

            // VIDEO
            string streamPath = Path.Combine(directoryPath, Path.GetFileName(entity.StreamUrl));
            await _mediaService.DownloadFile(entity.StreamUrl, streamPath, ct, entity.Id, MediaType.Magazine);

            // POSTER
            string posterPath = Path.Combine(directoryPath, Path.GetFileName(entity.PosterImageUrl));
            await _mediaService.DownloadFile(entity.PosterImageUrl, posterPath, ct, entity.Id, MediaType.Magazine);

        }

    }
}
