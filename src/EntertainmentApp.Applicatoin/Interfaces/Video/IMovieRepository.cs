using EntertainmentApp.Domain.Entities.Shared;
using EntertainmentApp.Domain.Entities.Video;

namespace EntertainmentApp.Applicatoin.Interfaces.Video
{
    public interface IMovieRepository
    {
        public Task<Genre?> GetGenreAsync(string movieGenre);
        public Task<Genre> AddGenreAsync(Genre genre);
        public Task<Director?> GetDirectorAsync(string directorName);
        public Task<Director> AddDirectorAsync(Director director);
        public Task<Actor?> GetActorAsync(string actorName);
        public Task<Actor> AddActorAsync(Actor actor);
        public Task<Movie> AddMovieAsync(Movie movie);
    }
}
