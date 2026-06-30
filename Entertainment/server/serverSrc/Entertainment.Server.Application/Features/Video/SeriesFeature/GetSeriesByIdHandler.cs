namespace Entertainment.Server.Applicatoin.Features.Video.SeriesFeature
{
    public record GetSeriesByIdQuery(Guid SeriesId) : IQuery<SeriesDto>;
    public class GetSeriesByIdHandler : IQueryHandler<GetSeriesByIdQuery, SeriesDto>
    {
        private readonly ISeriesRepository _seriesRepository;
        public GetSeriesByIdHandler(ISeriesRepository seriesRepository)
        {
            _seriesRepository = seriesRepository;
        }
        public async Task<SeriesDto> Handle(GetSeriesByIdQuery query, CancellationToken cancellationToken)
        {
            Series series = await _seriesRepository.GetSeriesByIdAsync(query.SeriesId);
            if (series == null)
            {
                throw new NotFoundException("Series not found");
            }
            return series.ToSeriesDto();
        }
    }
}
