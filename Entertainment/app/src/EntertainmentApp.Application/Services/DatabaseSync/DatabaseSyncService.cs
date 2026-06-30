namespace EntertainmentApp.Application.Services.DatabaseSync
{
    public class DatabaseSyncService : IDatabaseSyncService
    {
        private readonly IVideoDatabaseSync _videoSync;
        private readonly IMusicDatabaseSync _musicSync;
        private readonly IStoryDtabaseSync _storySync;
        private readonly IPublicationDatabaseSync _publicationSync;
        private readonly ICoruDatabaseSync _coruSync;

        public DatabaseSyncService(IVideoDatabaseSync videoSync, IMusicDatabaseSync musicSync, IStoryDtabaseSync storySync, IPublicationDatabaseSync publicationSync, ICoruDatabaseSync coruSync)
        {
            _videoSync = videoSync;
            _musicSync = musicSync;
            _storySync = storySync;
            _publicationSync = publicationSync;
            _coruSync = coruSync;
        }

        public async Task<DatabaseSyncedResult> SyncDatabaseAsync(GetAllMediaResponse allMedia)
        {
            if (allMedia == null) return null;
            DatabaseSyncedResult result = new DatabaseSyncedResult();
            if (allMedia.Movies != null)
                result.Movies = await _videoSync.SyncMovieAsync(allMedia.Movies);

            if (allMedia.Series != null )
                result.Series = await _videoSync.SyncSeriesAsync(allMedia.Series);



            if (allMedia.Tracks != null )
                result.Tracks = await _musicSync.SyncTrackAsync(allMedia.Tracks);

            if (allMedia.Albums != null)
                result.Albums = await _musicSync.SyncAlbumAsync(allMedia.Albums);



            if (allMedia.Books != null)
                result.Books = await _storySync.SyncBookAsync(allMedia.Books);
            if (allMedia.AudioStories != null)
                result.AudioStories = await _storySync.SyncAudioStoryAsync(allMedia.AudioStories);
            if (allMedia.PodCasts != null)
                result.PodCasts= await _storySync.SyncPodCastAsync(allMedia.PodCasts);

            
            
            if (allMedia.NewsPapers != null)
                result.NewsPapers = await _publicationSync.SyncNewsPaperAsync(allMedia.NewsPapers);
            if (allMedia.Magazines != null)
                result.Magazines = await _publicationSync.SyncMagazineAsync(allMedia.Magazines);


            if (allMedia.Corus != null)
                result.Corus = await _coruSync.SyncCoruAsync(allMedia.Corus);
            //important: should do the same for other types of media ....

            return result;
        }

    }
}
