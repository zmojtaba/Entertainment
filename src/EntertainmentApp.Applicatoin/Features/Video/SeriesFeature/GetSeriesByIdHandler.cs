namespace EntertainmentApp.Applicatoin.Features.Video.SeriesFeature
{
    public class GetSeriesByIdHandler
    {
        public record GetSeriesByIdQuery(Guid SeriesId) : IQuery<SeriesDto>;
        public class GetSeriesByIdQueryHandler : IQueryHandler<GetSeriesByIdQuery, SeriesDto>
        {
            private readonly ISeriesRepository _seriesRepository;
            public GetSeriesByIdQueryHandler(ISeriesRepository seriesRepository)
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
}
