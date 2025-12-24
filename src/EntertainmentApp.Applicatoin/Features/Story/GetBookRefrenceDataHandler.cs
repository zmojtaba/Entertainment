using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Story;
using static EntertainmentApp.Applicatoin.Features.BookFeature.GetBookRefrenceDataHandler;

namespace EntertainmentApp.Applicatoin.Features.BookFeature
{
    public class GetBookRefrenceDataHandler
    {
        public record GetBookRefrenceDataResponse(
                List<GenreDto> Genres,
                List<string> Languages,
                List<WriterDto> Writers
            );
        public record GetBookRefrenceDataQuery : IQuery<GetBookRefrenceDataResponse>;
    }
    public class GetBookRefrenceDataQueryHandler(IStoryRepository storyRepo) : IQueryHandler<GetBookRefrenceDataQuery, GetBookRefrenceDataResponse>
    {
        public async Task<GetBookRefrenceDataResponse> Handle(GetBookRefrenceDataQuery request, CancellationToken cancellationToken)
        {
            List<Genre> genres = await storyRepo.GetStoryGenresAsync();
            List<Writer> writers = await storyRepo.GetAllWritersAsync();
            return new GetBookRefrenceDataResponse(
                    genres.Select(g => g.ToGenreDto()).ToList(),
                    LanguageList.Languages,
                    writers.Select(w => w.ToWriterDto()).ToList()
                    );
        }
    }

}
