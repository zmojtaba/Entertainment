namespace EntertainmentApp.Infrastructure.Downloaders
{
    public class CoruDownloader : IMediaDownloader
    {
        public MediaType Type => MediaType.Coru;
        private readonly ICoruRepository _repo;
        private readonly IMediaService _mediaService;
        private readonly IConfiguration _configuration;
        private readonly IDownloadProgressNotifier _progressNotifier;
        private readonly ILogger<CoruDownloader> _logger;


        public CoruDownloader(ICoruRepository repo,
            IMediaService mediaService,
            IConfiguration configuration,
            IDownloadProgressNotifier progressNotifier,
            ILogger<CoruDownloader> logger)
        {
            _repo = repo;
            _mediaService = mediaService;
            _configuration = configuration;
            _progressNotifier = progressNotifier;
            _logger = logger;
        }


        public async Task DownloadAsync(Guid id, CancellationToken ct)
        {
            Coru entity = await _repo.GetCoruByIdAsync(id);
            if (entity == null) return;

            entity.ChangeDownloadStatus(DownloadStatus.Downloading);
            entity.ChangeCurrentlyDownload(true);
            await _repo.UpdateCoruAsync(entity);
            try
            {
                await DownloadCoruAsync(entity, ct);

                entity.ChangeDownloadStatus(DownloadStatus.Completed);
                entity.ChangeCurrentlyDownload(false);
            }
            catch (Exception ex)
            {
                entity.ChangeDownloadStatus(DownloadStatus.Failed);
                entity.SetDownloadErrorMessage(ex.Message);
                _logger.LogError($"###### error in downloading Coru:  {entity.Id}");
                await _progressNotifier.ReportAsync(new DownloadProgress
                {
                    Id = id,
                    MediaType = MediaType.Coru.ToString(),
                    FileType = "Stream",
                    //EpisodeId = entity.Id,
                    Percentage = 100,
                    DownloadedBytes = 0,
                    TotalBytes = 0,
                    Status = DownloadStatus.Failed,
                    ErrorMessage = ex.Message
                });

            }
            await _repo.UpdateCoruAsync(entity);
        }

        private async Task DownloadCoruAsync(Coru entity, CancellationToken ct)
        {
            string directoryPath = Path.Combine(_configuration["BaseStoragePath"], Path.GetDirectoryName(entity.StreamUrl));

            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);

            // VIDEO
            string streamPath = Path.Combine(directoryPath, Path.GetFileName(entity.StreamUrl));
            await _mediaService.DownloadFile(entity.StreamUrl, streamPath, ct, entity.Id, MediaType.Coru);


        }


    }
}
