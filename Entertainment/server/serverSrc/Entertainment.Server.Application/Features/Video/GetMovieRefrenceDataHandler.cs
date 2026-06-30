namespace Entertainment.Server.Applicatoin.Features.Video
{
    public record GetMovieRefrenceDataQuery() : IQuery<GetMovieRefrenceDataResponse>;
    public record GetMovieRefrenceDataResponse( List<string> Genres, List<ActorDto> Actors, List<DirectorDto>  Directores, List<string> Languages, List<string> Countries);

    public class GetMovieRefrenceDataHandler(IMovieRepository movieRepo)  : IQueryHandler<GetMovieRefrenceDataQuery,  GetMovieRefrenceDataResponse>
    {
        public async Task<GetMovieRefrenceDataResponse> Handle(GetMovieRefrenceDataQuery request, CancellationToken cancellationToken)
        {
            List<Genre> genres = await movieRepo.GetMovieGenresAsync();
            List<Actor> actors = await movieRepo.GetAllActorsAsync();
            List<Director> directors = await movieRepo.GetAllDirector();
            List<string> languages = LanguageList.Languages;
            List<string> countries = CountryList.Countries;

            return new GetMovieRefrenceDataResponse
            (
                Genres : genres.Select(g => g.Title).ToList(),
                Actors : actors.Select(a => a.ToActorDto()).ToList(),
                Directores : directors.Select(d => d.ToDirectorDto()).ToList(),
                Languages : languages,
                Countries : countries
            );

        }
    }
}
