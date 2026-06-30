using System.Net.NetworkInformation;

namespace EntertainmentApp.Infrastructure.Hubs
{
    public class SignalRDownloadProgressNotifier : IDownloadProgressNotifier
    {
        private readonly IHubContext<DownloadHub> _hub;

        public SignalRDownloadProgressNotifier(IHubContext<DownloadHub> hub)
        {
            _hub = hub;
        }

        public async Task ReportAsync(DownloadProgress progress)
        {
            await _hub.Clients.All.SendAsync("DownloadProgress", progress);
            // await Task.Delay(4000);
        }
    }
}
