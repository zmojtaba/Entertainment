using EntertainmentApp.Applicatoin.Interfaces.CoruRepository;
using EntertainmentApp.Domain.Entities;

namespace EntertainmentApp.Applicatoin.Features.CoruFeature
{
    public class GetCorusHandler
    {
        public record GetCorousQuery() : IQuery<List<CoruDto>>;
        public class GetCorousHandler : IQueryHandler<GetCorousQuery, List<CoruDto>>
        {
            private readonly ICoruRepository _coruRepository;
            public GetCorousHandler(ICoruRepository coruRepository)
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
}
