namespace EntertainmentApp.Applicatoin.Features.Video.MoviesFeature
{
    public record GetMoviesQuery(string? language, string? genre ) : IQuery<List<MovieDto>>;
    public class GetMoviesHandler : IQueryHandler<GetMoviesQuery, List<MovieDto>>
    {
        private readonly IMovieRepository _movieRepo;
        public GetMoviesHandler(IMovieRepository movieRepository)
        {
            _movieRepo = movieRepository;
        }
        public async Task<List<MovieDto>> Handle(GetMoviesQuery request, CancellationToken cancellationToken)
        {
            List<Movie> movies = null;
            if (!string.IsNullOrEmpty(request.language) && string.IsNullOrEmpty(request.genre))
                movies = await _movieRepo.GetMoviesByLanguage((request.language));
            else if (!string.IsNullOrEmpty(request.language) && !string.IsNullOrEmpty(request.genre))
                movies = await _movieRepo.GetMovieByFilterAsync(request.language, request.genre);
            else if (string.IsNullOrEmpty(request.language) && !string.IsNullOrEmpty(request.genre))
                movies = await _movieRepo.GetMoviesByGenre((request.genre));
            else movies = await _movieRepo.GetAllMoviesAsync();

            if (movies == null || !movies.Any())
                throw new NotFoundException("Movie Not found");

            List<MovieDto> result = movies.Select(m => m.ToMoveDto()).ToList();
            return result;    
        }
    }
}
