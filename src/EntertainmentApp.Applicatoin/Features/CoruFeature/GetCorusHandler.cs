using EntertainmentApp.Applicatoin.Interfaces.CoruRepository;
using EntertainmentApp.Domain.Entities;

namespace EntertainmentApp.Applicatoin.Features.CoruFeature
{
    public class GetCorusHandler
    {
        public record GetCorousCommand() : ICommand<List<Coru>>;
        public class GetCorousHandler : ICommandHandler<GetCorousCommand, List<Coru>>
        {
            private readonly ICoruRepository _coruRepository;
            public GetCorousHandler(ICoruRepository coruRepository)
            {
                _coruRepository = coruRepository;
            }
            public async Task<List<Coru>> Handle(GetCorousCommand request, CancellationToken cancellationToken)
            {
                var corus = await _coruRepository.GetAllCorusAsync();
                if (corus == null || !corus.Any())
                {
                    throw new NotFoundException("Corus Not found");
                }
                return corus;
            }

        }
    }
}
