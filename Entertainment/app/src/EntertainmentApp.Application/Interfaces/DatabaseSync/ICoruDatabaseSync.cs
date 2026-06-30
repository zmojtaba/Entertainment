namespace EntertainmentApp.Application.Interfaces.DatabaseSync
{
    public interface ICoruDatabaseSync
    {
        public Task<DatabaseCategorySyncedResult> SyncCoruAsync(List<CoruDto> entities);
    }
}
