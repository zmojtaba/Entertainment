
namespace EntertainmentApp.Application.Features.Video.SeriesFeature
{
    public record GetSeriesQuery(string? language, string? genre) : IQuery<List<SeriesDto>>;
    public class GetSeriesHandler(ISeriesRepository seriesRepo) : IQueryHandler<GetSeriesQuery, List<SeriesDto>>
    {
        public async Task<List<SeriesDto>> Handle(GetSeriesQuery request, CancellationToken cancellationToken)
        {
            List<Series> series = null;
            if (!string.IsNullOrEmpty(request.language) && string.IsNullOrEmpty(request.genre))
                series = await seriesRepo.GetSeriesByLanguageAsync((request.language));
            else if(!string.IsNullOrEmpty(request.language) && !string.IsNullOrEmpty(request.genre))           
                series = await seriesRepo.GetSeriesByFilterAsync(request.language, request.genre);
            else if (string.IsNullOrEmpty(request.language) && !string.IsNullOrEmpty(request.genre))
                series = await seriesRepo.GetSeriesByGenreAsync((request.genre));
            else series = await seriesRepo.GetAllSeriesAsync();

            if (series==null || !series.Any())
                throw new NotFoundException("Series Not found");

            return series.Select(s => s.ToSeriesDto()).ToList();
        }
    }
}
