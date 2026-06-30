namespace EntertainmentApp.Application.Interfaces.DatabaseSync
{
    public interface IStoryDtabaseSync
    {
        public Task<DatabaseCategorySyncedResult> SyncAudioStoryAsync(List<AudioStoryDto> entities);
        public Task<DatabaseCategorySyncedResult> SyncBookAsync(List<BookDto> entities);
        public Task<DatabaseCategorySyncedResult> SyncPodCastAsync(List<PodCastDto> entities);
    }
}
