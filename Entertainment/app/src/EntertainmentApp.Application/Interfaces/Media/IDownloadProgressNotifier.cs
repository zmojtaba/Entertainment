namespace EntertainmentApp.Application.Interfaces.Media
{
    public interface IDownloadProgressNotifier
    {
        Task ReportAsync(DownloadProgress progress);
    }
}
