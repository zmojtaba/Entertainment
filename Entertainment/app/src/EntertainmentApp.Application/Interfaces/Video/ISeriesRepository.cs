using EntertainmentApp.Domain.Entities.Video;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace EntertainmentApp.Application.Interfaces.Video
{
    public interface ISeriesRepository
    {
        public  Task SaveChangesAsync();
        public Task<Series> AddSeriesAsync(Series series);
        public Task<Series> GetSeriesByIdAsync(Guid id);
        public Task<List<Series>> GetAllSeriesAsync();
        public Task<List<Series>> GetSeriesByLanguageAsync(string language);
        public Task<List<Series>> GetSeriesByGenreAsync(string genre);
        public Task<List<Series>> GetSeriesByFilterAsync(string language, string genre);
        public Task<Series> UpdateSeriesAsync(Series series);
        public Task DeleteSeriesAsync(Series series);

        public Task<Season> AddSeasonAsync(Season season);
        public Task<Season> UpdateSeasonAsync(Season season);
        public Task<Season> GetSeasonByIdAsync(Guid id);
        public Task DeleteSeasonAsync(Season season);

        public Task<Episode> AddEpisodeAsync(Episode episode);
        public Task<Episode> GetEpisodeByIdAsync(Guid id);
        public Task DeleteEpisodeAsync(Episode episode);





        public  Task<List<Guid>> GetNotExistSeriesId(List<Guid> ids);
        public  Task<List<Guid>> GetNotExistOnSeverSeriesId(List<Guid> ids);

        public  Task<List<Episode>> GetEpisodesNeedToDownloadAsync();
        public Task<Series?> GetSeriesByEpisodeIdAsync(Guid episodeId);
        public  Task UpdateEpisodeAsync(Episode episode);
        public Task<List<Series>> GetSeriesNeedToDownloadAsync();




    }
}
