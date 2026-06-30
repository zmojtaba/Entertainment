namespace EntertainmentApp.Application.Interfaces.DatabaseSync
{
    public interface IDatabaseSyncService
    {
        public Task<DatabaseSyncedResult> SyncDatabaseAsync(GetAllMediaResponse allMedia);
    }
}
