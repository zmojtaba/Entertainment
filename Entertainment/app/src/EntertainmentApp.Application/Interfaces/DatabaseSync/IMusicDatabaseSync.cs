namespace EntertainmentApp.Application.Interfaces.DatabaseSync
{
    public interface IMusicDatabaseSync
    {
        public Task<DatabaseCategorySyncedResult> SyncTrackAsync(List<TrackDto> tracks);
        public Task<DatabaseCategorySyncedResult> SyncAlbumAsync(List<AlbumDto> albums);
    }
}
