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
            return await _context.Genres.FindAsync(movieGenre);
        }

        public async Task<Genre> AddGenreAsync(Genre genre)
        {
            await _context.Genres.AddAsync(genre);
            await _context.SaveChangesAsync();
            return genre;
        }

        public async Task<List<Genre>> GetMovieGenresAsync()
        {
            return await _context.Genres.Where(g => g.Movies.Any()).ToListAsync(); 
        }

        public async Task<Director?> GetDirectorAsync(string directorName)
        {
            return await _context.Directors.FindAsync(directorName);

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
            return await _context.Actors.FindAsync(actorName);
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
                .ToListAsync();
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


    }
}
