using EntertainmentApp.Applicatoin.Interfaces.CoruRepository;
using EntertainmentApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.CoruFeature
{
    public class StopCoruHandler
    {
        public record StopCoruCommand(Guid Id) : IQuery<bool>;
        public class StopCoruCommandHandler(ICoruRepository coruRepo, IAudioPlayerService _audioPlayer, IConfiguration config) : IQueryHandler<StopCoruCommand, bool>
        {
            public async Task<bool> Handle(StopCoruCommand request, CancellationToken cancellationToken)
            {
                Coru coru = await coruRepo.GetCoruByIdAsync(request.Id);
                if (coru == null) throw new NotFoundException("Coru Not Found");
                _audioPlayer.Stop();
                return await Task.FromResult(true);
            }
        }
    }
}
