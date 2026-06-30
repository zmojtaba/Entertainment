namespace EntertainmentApp.Application.Interfaces.Media
{
    public interface IDownloadQueueSyncService
    {
        public Task SyncQueueAsync();
    }
}
