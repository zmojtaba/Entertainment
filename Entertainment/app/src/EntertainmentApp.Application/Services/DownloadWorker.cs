namespace EntertainmentApp.Application.Services
{
    public class DownloadWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IDownloadQueue _queue;
        public DownloadWorker(IServiceScopeFactory scopeFactory, IDownloadQueue queue)
        {
            _scopeFactory = scopeFactory;
            _queue = queue;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var parallelism = 1; // configurable

            var tasks = Enumerable.Range(0, parallelism)
                .Select(_ => Task.Run(() => WorkerLoop(stoppingToken), stoppingToken));

            await Task.WhenAll(tasks);
        }

        private async Task WorkerLoop(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var apiClient = scope.ServiceProvider.GetService<IMediaApiClient>();
                if (!await apiClient.IsReachableAsync())
                {
                    await Task.Delay(TimeSpan.FromMinutes(1));
                    //await Task.Delay(TimeSpan.FromSeconds(10));
                    continue;
                }
                if (_queue.TryDequeue(out var item))
                {

                    var downloaders = scope.ServiceProvider.GetServices<IMediaDownloader>();
                    var downloader = downloaders.FirstOrDefault(x => x.Type == item.Type);

                    if (downloader == null)
                        continue;

                    try
                    {
                        await downloader.DownloadAsync(item.Id, stoppingToken);
                    }
                    catch
                    {
                        // optional retry logic
                    }
                }
                else
                {
                    await Task.Delay(10000, stoppingToken);
                }
            }
        }
    }
}
