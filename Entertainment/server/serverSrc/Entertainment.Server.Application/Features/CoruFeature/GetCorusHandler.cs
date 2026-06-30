namespace Entertainment.Server.Applicatoin.Features.CoruFeature
{
    public record GetCorousQuery() : IQuery<List<CoruDto>>;
    public class GetCorusHandler : IQueryHandler<GetCorousQuery, List<CoruDto>>
    {
        private readonly ICoruRepository _coruRepository;
        public GetCorusHandler(ICoruRepository coruRepository)
        {
            _coruRepository = coruRepository;
        }
        public async Task<List<CoruDto>> Handle(GetCorousQuery request, CancellationToken cancellationToken)
        {
            var corus = await _coruRepository.GetAllCorusAsync();
            if (corus == null || !corus.Any())
            {
                throw new NotFoundException("Corus Not found");
            }
            return corus.Select(c => c.ToCoruDto()).ToList();
        }
    }
}
