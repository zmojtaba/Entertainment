namespace EntertainmentApp.Application.Interfaces.DatabaseSync
{
    public interface IPublicationDatabaseSync
    {
        public Task<DatabaseCategorySyncedResult> SyncMagazineAsync(List<MagazineDto> entities);
        public Task<DatabaseCategorySyncedResult> SyncNewsPaperAsync(List<NewsPaperDto> entities);
    }
}
