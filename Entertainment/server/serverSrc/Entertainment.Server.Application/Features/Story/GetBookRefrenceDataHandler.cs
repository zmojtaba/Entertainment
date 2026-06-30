namespace Entertainment.Server.Applicatoin.Features.BookFeature
{
    public record GetBookRefrenceDataQuery : IQuery<GetBookRefrenceDataResponse>;
    public record GetBookRefrenceDataResponse(
            List<string> Genres,
            List<string> Languages,
            List<WriterDto> Writers
        );
    public class GetBookRefrenceDataHandler(IStoryRepository storyRepo) : IQueryHandler<GetBookRefrenceDataQuery, GetBookRefrenceDataResponse>
    {
        public async Task<GetBookRefrenceDataResponse> Handle(GetBookRefrenceDataQuery request, CancellationToken cancellationToken)
        {
            List<Genre> genres = await storyRepo.GetStoryGenresAsync();
            List<Writer> writers = await storyRepo.GetAllWritersAsync();
            return new GetBookRefrenceDataResponse(
                    genres.Select(g => g.Title).ToList(),
                    LanguageList.Languages,
                    writers.Select(w => w.ToWriterDto()).ToList()
                    );
        }
    }

}
