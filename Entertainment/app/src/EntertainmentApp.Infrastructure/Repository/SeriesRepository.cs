namespace EntertainmentApp.Infrastructure.Repository
{
    public class SeriesRepository : ISeriesRepository
    {
        private readonly ApplicationDBContext _context;
        public SeriesRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<Series> AddSeriesAsync(Series series)
        {
            await _context.Series.AddAsync(series);
            await _context.SaveChangesAsync();
            return series;

        }

        public async Task<Series?> GetSeriesByIdAsync(Guid id)
        {
            return await _context.Series
                .Include(s => s.Actors)
                .Include(s => s.Genres)
                .Include(s => s.Directors)
                .Include(s => s.Seasons)
                .ThenInclude(s => s.Episodes).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<Series>> GetAllSeriesAsync()
        {
            return await _context.Series
                .Include(s => s.Actors)
                .Include(s => s.Genres)
                .Include(s => s.Directors)
                .Include(s => s.Seasons)
                .ThenInclude(s => s.Episodes)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Series>> GetSeriesByGenreAsync(string genre)
        {
            return await _context.Series
                .Include(s => s.Actors)
                .Include(s => s.Genres)
                .Include(s => s.Directors)
                .Include(s => s.Seasons)
                .ThenInclude(s => s.Episodes)
                .OrderByDescending(s => s.CreatedAt)
                .Where(s => s.Genres.Any(g => g.Title.ToLower() == genre.ToLower())).ToListAsync();
        }

        public async Task<List<Series>> GetSeriesByLanguageAsync(string language)
        {
            if (language.Equals("persian", StringComparison.OrdinalIgnoreCase))
                return await _context.Series
                    .Include(s => s.Actors)
                    .Include(s => s.Genres)
                    .Include(s => s.Directors)
                    .Include(s => s.Seasons)
                    .ThenInclude(s => s.Episodes)
                    .OrderByDescending(s => s.CreatedAt)
                    .Where(s => s.Languages.Any(l => l.ToLower() == language.ToLower())).ToListAsync();

            return await _context.Series
                .Include(s => s.Actors)
                .Include(s => s.Genres)
                .Include(s => s.Directors)
                .Include(s => s.Seasons)
                .ThenInclude(s => s.Episodes)
                .OrderByDescending(s => s.CreatedAt)
                .Where(s => s.Languages.Any(l => l.ToLower() != "persian")).ToListAsync();
        }

        public async Task<List<Series>> GetSeriesByFilterAsync(string language, string genre)
        {
            if (language.Equals("persian", StringComparison.OrdinalIgnoreCase))
                return await _context.Series
                    .Include(s => s.Actors)
                    .Include(s => s.Genres)
                    .Include(s => s.Directors)
                    .Include(s => s.Seasons)
                    .ThenInclude(s => s.Episodes)
                    .OrderByDescending(s => s.CreatedAt)
                    .Where(s =>
                        s.Languages.Any(l => l.ToLower() == "persian") &&
                        s.Genres.Any(g => g.Title.ToLower() == genre.ToLower())
                    ).ToListAsync();

            return await _context.Series
                    .Include(s => s.Actors)
                    .Include(s => s.Genres)
                    .Include(s => s.Directors)
                    .Include(s => s.Seasons)
                    .OrderByDescending(s => s.CreatedAt)
                    .Where(s =>
                        s.Languages.Any(l => l.ToLower() != "persian") &&
                        s.Genres.Any(g => g.Title.ToLower() == genre.ToLower())
                    ).ToListAsync();

        }


        public async Task<Series> UpdateSeriesAsync(Series series)
        {
            _context.Series.Update(series);
            await _context.SaveChangesAsync();
            return series;
        }



        public async Task DeleteSeriesAsync(Series series)
        {
            _context.Series.Remove(series);
            await _context.SaveChangesAsync();
        }


        public async Task<Season> AddSeasonAsync(Season season)
        {
            await _context.Seasons.AddAsync(season);
            await _context.SaveChangesAsync();
            return season;
        }


        public async Task<Season> UpdateSeasonAsync(Season season)
        {
            _context.Seasons.Update(season);
            await _context.SaveChangesAsync();
            return season;
        }
        public async Task<Season?> GetSeasonByIdAsync(Guid id)
        {
            return await _context.Seasons.Include(s => s.Episodes).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task DeleteSeasonAsync(Season season)
        {
            _context.Seasons.Remove(season);
            await _context.SaveChangesAsync();
        }

        public async Task<Episode> AddEpisodeAsync(Episode episode)
        {
            await _context.Episodes.AddAsync(episode);
            await _context.SaveChangesAsync();
            return episode;

        }

        public async Task<Episode?> GetEpisodeByIdAsync(Guid id)
        {
            return await _context.Episodes.FindAsync(id);
        }

        public async Task DeleteEpisodeAsync(Episode episode)
        {
            _context.Episodes.Remove(episode);
            await _context.SaveChangesAsync();
        }



        public async Task<List<Guid>> GetNotExistSeriesId(List<Guid> ids)
        {
            var existingIds = await _context.Series
                .Where(m => ids.Contains(m.Id))
                .Select(m => m.Id)
                .ToListAsync();

            var notExistingIds = ids.Except(existingIds).ToList();

            return notExistingIds;
        }
        public async Task<List<Guid>> GetNotExistOnSeverSeriesId(List<Guid> ids)
        {
            var serverIds = await _context.Series
                .Select(m => m.Id)
                .ToListAsync();

            return serverIds.Except(ids).ToList();
        }

        public async Task<List<Episode>> GetEpisodesNeedToDownloadAsync()
        {
            var excludedStatuses = new[]
            {
                DownloadStatus.NotNeed,
                DownloadStatus.Completed
            };

            return await _context.Episodes
                .Where(x => !excludedStatuses.Contains(x.DownloadStatus))
                //.Select(x => x.Id)
                .ToListAsync();
        }

        public async Task<List<Series>> GetSeriesNeedToDownloadAsync()
        {
            var excludedStatuses = new[]
{
                DownloadStatus.NotNeed,
                DownloadStatus.Completed
            };

            return await _context.Series.Include(s => s.Seasons)
                    .ThenInclude(se => se.Episodes)
                .Where(x => !excludedStatuses.Contains(x.DownloadStatus))
                //.Select(x => x.Id)
                .ToListAsync();
        }



        public async Task<Series?> GetSeriesByEpisodeIdAsync(Guid episodeId)
        {
            return await _context.Series
                .Include(s => s.Seasons)
                    .ThenInclude(se => se.Episodes)
                .FirstOrDefaultAsync(ser =>
                    ser.Seasons.Any(sea =>
                        sea.Episodes.Any(e => e.Id == episodeId)));
        }


        public async Task UpdateEpisodeAsync(Episode episode)
        {
            _context.Episodes.Update(episode);
            await _context.SaveChangesAsync();
        }




    }
}
