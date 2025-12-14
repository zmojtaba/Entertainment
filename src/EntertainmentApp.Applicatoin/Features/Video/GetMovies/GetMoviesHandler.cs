



using EntertainmentApp.Applicatoin.Common.Dtos;

namespace EntertainmentApp.Applicatoin.Features.Video.GetMoviesAsync
{
    public record GetMoviesQuery() : IQuery<List<MovieDto>>;
    public class GetMoviesHandler : IQueryHandler<GetMoviesQuery, List<MovieDto>>
    {
        private readonly IMovieRepository _movieRepo;
        public GetMoviesHandler(IMovieRepository movieRepository)
        {
            _movieRepo = movieRepository;
        }
        public async Task<List<MovieDto>> Handle(GetMoviesQuery request, CancellationToken cancellationToken)
        {
            List<Movie> movies = await _movieRepo.GetAllMoviesAsync();
            if (!movies.Any()) throw new NotFoundException("Movie not found");
            List<MovieDto> result = movies.Select(m => m.ToMoveDto()).ToList();
            return result;    
        }
    }
}
