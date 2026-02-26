namespace EntertainmentApp.Applicatoin.Features.Video
{
    public record DeleteGenreCommand(string Genre) : ICommand;

    public class DeleteGenreHandler : ICommandHandler<DeleteGenreCommand>
    {
        private readonly IMovieRepository _movieRepository;
        private readonly ISeriesRepository _seriesRepository;
        private readonly IMediaService _mediaService;
        public DeleteGenreHandler(IMovieRepository movieRepository, IMediaService mediaService, ISeriesRepository seriesRepository)
        {
            _movieRepository = movieRepository;
            _mediaService = mediaService;
            _seriesRepository = seriesRepository;
        }
        public async Task<Unit> Handle(DeleteGenreCommand command, CancellationToken cancellationToken)
        {
            Genre? genre = await _movieRepository.GetGenreAsync(command.Genre);
            if (genre == null) throw new NotFoundException($"Genre '{command.Genre}' not found");

            List<Movie> movies = await _movieRepository.GetMoviesByGenre(command.Genre);
            /// movie part
            List<Movie> moviesToDelete = new List<Movie>();
            foreach (Movie movie in movies)
            {
                if (movie.RemoveGenre(genre))  moviesToDelete.Add(movie);
            }

            foreach (Movie movie in moviesToDelete)
            {
                await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(movie.StreamUrl), true);
                await _movieRepository.DeleteMovieAsync(movie);
            }

            //// series part should be implemented in the future when series feature is implemented
            ///
            List<Series> series = await _seriesRepository.GetSeriesByGenreAsync(command.Genre);
            List<Series> seriesToDelete = new List<Series>();
            foreach (Series s in series)
            {
                if (s.RemoveGenre(genre)) seriesToDelete.Add(s);
            }

            foreach (Series s in seriesToDelete)
            {
                await _mediaService.DeleteMediaDirecoryAsync(
                    Path.GetDirectoryName(s.PosterImageUrl), true
                    );
                await _seriesRepository.DeleteSeriesAsync(s);
            }

            await _movieRepository.DeleteGenreAsync(genre);
            return Unit.Value;
        }
    }
}
