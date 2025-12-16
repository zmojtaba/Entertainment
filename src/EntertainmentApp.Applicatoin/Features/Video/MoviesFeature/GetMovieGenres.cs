namespace EntertainmentApp.Applicatoin.Features.Video.MoviesFeature
{
    public record GetMovieGenresQuery : IQuery<List<GenreDto>>;

    public class GetMovieGenres(IMovieRepository movieRepo) : IQueryHandler<GetMovieGenresQuery, List<GenreDto>>
    {
        public async Task<List<GenreDto>> Handle(GetMovieGenresQuery request, CancellationToken cancellationToken)
        {
            List<Genre> genres = await movieRepo.GetMovieGenresAsync();
            if (!genres.Any()) throw new NotFoundException("Genre not found");
            return genres.Select(g => g.ToGenreDto()).ToList();
        }
    }
}
