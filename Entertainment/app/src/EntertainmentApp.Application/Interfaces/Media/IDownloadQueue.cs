namespace EntertainmentApp.Application.Interfaces.Media
{
    public interface IDownloadQueue
    {
        public bool TryDequeue(out DownloadItem item);
        public void Enqueue(DownloadItem item);
        public DownloadItem GetCurrentlyDownload();
    }
}
