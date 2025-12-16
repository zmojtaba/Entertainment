
namespace EntertainmentApp.Applicatoin.Interfaces.Video
{
    public interface IMovieRepository
    {
        public Task<Genre?> GetGenreAsync(string movieGenre);
        public Task<Genre> AddGenreAsync(Genre genre);
        public Task<List<Genre>> GetMovieGenresAsync();


        public Task<Director?> GetDirectorAsync(string directorName);
        public Task<Director> AddDirectorAsync(Director director);
        public Task<List<Director>> GetAllDirector();


        public Task<Actor?> GetActorAsync(string actorName);
        public Task<List<Actor>> GetAllActorsAsync();
        public Task<Actor> AddActorAsync(Actor actor);


        public Task<Movie> AddMovieAsync(Movie movie);
        public Task<List<Movie>> GetAllMoviesAsync();
        public Task<List<Movie>> GetMoviesByLanguage(string language);
        public Task<List<Movie>> GetMoviesByGenre(string genre);
        public Task<List<Movie>> GetMovieByFilterAsync(string language, string genre);
        public Task<Movie> GetMovieByIdAsync(Guid id);
        public Task DeleteMovieAsync(Movie movie);
        public Task<Movie> UpdateMovieAsync(Movie movie);
    }
}
