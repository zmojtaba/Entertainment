namespace EntertainmentApp.Application.Interfaces.DatabaseSync
{
    public interface IVideoDatabaseSync
    {
        public Task<DatabaseCategorySyncedResult> SyncMovieAsync(List<MovieDto> movies);
        public Task<DatabaseCategorySyncedResult> SyncSeriesAsync(List<SeriesDto> seriesList);
    }
}
