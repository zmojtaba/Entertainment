namespace EntertainmentApp.Infrastructure.Repository
{
    public class MovieRepository : IMovieRepository
    {
        private readonly ApplicationDBContext _context;
        public MovieRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Genre?> GetGenreAsync(string movieGenre)
        {
            return await _context.Genres
                .Include(g => g.Movies).ThenInclude(m => m.Genres)
                .Include(g => g.Series).ThenInclude(m => m.Genres)
                .FirstOrDefaultAsync(g => g.Title.ToLower() == movieGenre.ToLower());
        }

        public async Task<Genre> AddGenreAsync(Genre genre)
        {
            await _context.Genres.AddAsync(genre);
            await _context.SaveChangesAsync();
            return genre;
        }

        public async Task<List<Genre>> GetMovieGenresAsync()
        {
            return await _context.Genres.Where(g => g.Movies.Any() || g.Series.Any() ||
            g.Categories.Any(x => x.ToLower() == "video")
            ).ToListAsync();
        }

        public async Task DeleteGenreAsync(Genre genre)
        {
            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();
        }

        public async Task<Director?> GetDirectorAsync(string directorName)
        {
            return await _context.Directors
                .FirstOrDefaultAsync(d =>
                    d.Name.ToLower() == directorName.ToLower());
        }

        public async Task<Director> AddDirectorAsync(Director director)
        {
            await _context.Directors.AddAsync(director);
            await _context.SaveChangesAsync();
            return director;
        }

        public async Task<List<Director>> GetAllDirector()
        {
            return await _context.Directors.ToListAsync();
        }




        public async Task<Actor?> GetActorAsync(string actorName)
        {
            return await _context.Actors.FirstOrDefaultAsync(a => a.Name.ToLower() == actorName.ToLower());
        }

        public async Task<List<Actor>> GetAllActorsAsync()
        {
            return await _context.Actors.ToListAsync();
        }

        public async Task<Actor> AddActorAsync(Actor actor)
        {
            await _context.Actors.AddAsync(actor);
            await _context.SaveChangesAsync();
            return actor;
        }



        public async Task<Movie> AddMovieAsync(Movie movie)
        {
            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();
            return movie;
        }
        public async Task<List<Movie>> GetAllMoviesAsync()
        {

            return await _context.Movies
                .Include(m => m.Genres)
                .Include(m => m.Actors)
                .Include(m => m.Directors)
                .Where(x => x.DownloadStatus == DownloadStatus.NotNeed || x.DownloadStatus == DownloadStatus.Completed)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Movie>> GetMoviesByLanguage(string language)
        {
            if (language.Equals("persian", StringComparison.OrdinalIgnoreCase))
                return await _context.Movies
                    .Include(m => m.Genres)
                    .Include(m => m.Actors)
                    .Include(m => m.Directors)
                    .OrderByDescending(m => m.CreatedAt)
                    .Where(m => m.Languages.Any(l => l.ToLower() == language.ToLower()))
                    .ToListAsync();

            return await _context.Movies
                .Include(m => m.Genres)
                .Include(m => m.Actors)
                .Include(m => m.Directors)
                .OrderByDescending(m => m.CreatedAt)
                .Where(m => m.Languages.Any(l => l.ToLower() != "persian"))
                .ToListAsync();
        }

        public async Task<List<Movie>> GetMoviesByGenre(string genre)
        {
            return await _context.Movies
                .Include(m => m.Genres)
                .Include(m => m.Actors)
                .Include(m => m.Directors)
                .OrderByDescending(m => m.CreatedAt)
                .Where(m => m.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .ToListAsync();
        }

        public async Task<List<Movie>> GetMovieByFilterAsync(string language, string genre)
        {
            if (language.Equals("persian", StringComparison.OrdinalIgnoreCase))
                return await _context.Movies
                    .Include(m => m.Actors)
                    .Include(m => m.Genres)
                    .Include(m => m.Directors)
                    .OrderByDescending(m => m.CreatedAt)
                    .Where(m =>
                        m.Languages.Any(l => l.ToLower() == "persian") &&
                        m.Genres.Any(g => g.Title.ToLower() == genre.ToLower())
                    ).ToListAsync();

            return await _context.Movies
                    .Include(m => m.Actors)
                    .Include(m => m.Genres)
                    .Include(m => m.Directors)
                    .OrderByDescending(m => m.CreatedAt)
                    .Where(m =>
                        m.Languages.Any(l => l.ToLower() != "persian") &&
                        m.Genres.Any(g => g.Title.ToLower() == genre.ToLower())
                    ).ToListAsync();
        }

        public async Task<Movie?> GetMovieByIdAsync(Guid id)
        {
            return await _context.Movies
                .Include(m => m.Genres)
                .Include(m => m.Actors)
                .Include(m => m.Directors)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task DeleteMovieAsync(Movie movie)
        {
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
        }

        public async Task<Movie> UpdateMovieAsync(Movie movie)
        {
            _context.Movies.Update(movie);
            await _context.SaveChangesAsync();
            return movie;
        }


        public async Task<List<Guid>> GetNotExistMoviesId(List<Guid> ids)
        {
            var existingIds = await _context.Movies
                .Where(m => ids.Contains(m.Id))
                .Select(m => m.Id)
                .ToListAsync();

            var notExistingIds = ids.Except(existingIds).ToList();

            return notExistingIds;
        }
        public async Task<List<Guid>> GetNotExistOnSeverMoviesId(List<Guid> ids)
        {
            var serverIds = await _context.Movies
                .Select(m => m.Id)
                .ToListAsync();

            return serverIds.Except(ids).ToList();
        }

        public async Task<List<Movie>> GetMoviesNeedToDownloadAsync()
        {
            var excludedStatuses = new[]
            {
                DownloadStatus.NotNeed,
                DownloadStatus.Completed
            };

            return await _context.Movies
                .Where(x => !excludedStatuses.Contains(x.DownloadStatus))
                //.Select(x => x.Id)
                .ToListAsync();
        }

    }
}
