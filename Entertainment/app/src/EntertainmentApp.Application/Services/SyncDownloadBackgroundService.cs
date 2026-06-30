namespace EntertainmentApp.Application.Services
{
    public class SyncDownloadBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private bool IsServerReachable = false;

        public SyncDownloadBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var mediaApiClient = scope.ServiceProvider.GetRequiredService<IMediaApiClient>();
                var databaseSync = scope.ServiceProvider.GetRequiredService<IDatabaseSyncService>();
                var queueSync = scope.ServiceProvider.GetRequiredService<IDownloadQueueSyncService>();

                IsServerReachable = await mediaApiClient.IsReachableAsync();

                if(!IsServerReachable)
                {
                    await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                    continue;
                }


                GetAllMediaResponse apiResult = await mediaApiClient.GetAllMediaMetaDataAsync();
                if (apiResult == null) continue;

                await databaseSync.SyncDatabaseAsync(apiResult);
                await Task.Delay(5000);

                await queueSync.SyncQueueAsync();


                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
