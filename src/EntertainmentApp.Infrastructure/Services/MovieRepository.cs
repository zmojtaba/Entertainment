using EntertainmentApp.Applicatoin.Interfaces.Video;
using EntertainmentApp.Domain.Entities.Shared;
using EntertainmentApp.Domain.Entities.Video;

namespace EntertainmentApp.Infrastructure.Services
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

        public async Task<Actor?> GetActorAsync(string actorName)
        {
            return await _context.Actors.FindAsync(actorName);
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
    }
}
