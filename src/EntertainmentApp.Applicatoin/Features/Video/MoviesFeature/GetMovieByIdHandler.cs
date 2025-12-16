namespace EntertainmentApp.Applicatoin.Features.Video.MoviesFeature
{
    public record GetMovieByIdQuery(Guid Id) : IQuery<MovieDto>;
    public class GetMovieByIdHandler(IMovieRepository movieRepo) : IQueryHandler<GetMovieByIdQuery, MovieDto>
    {
        public async Task<MovieDto> Handle(GetMovieByIdQuery request, CancellationToken cancellationToken)
        {
            Movie movie = await movieRepo.GetMovieByIdAsync(request.Id);
            if (movie == null) throw new NotFoundException("Movie not found");
            return movie.ToMoveDto();
        }
    }
}
