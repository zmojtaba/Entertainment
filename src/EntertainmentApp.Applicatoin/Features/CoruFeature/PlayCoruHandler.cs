using EntertainmentApp.Applicatoin.Interfaces.CoruRepository;
using EntertainmentApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.CoruFeature
{
    public class PlayCoruHandler
    {
        public record PlayCoruCommand(Guid Id) : IQuery<bool>;
        public class PlayCoruCommandHandler(ICoruRepository _coruRepository,
            IAudioPlayerService _audioPlayer,
            IConfiguration config) : IQueryHandler<PlayCoruCommand, bool>
        {
            public async Task<bool> Handle(PlayCoruCommand request, CancellationToken cancellationToken)
            {
                Coru coru = await _coruRepository.GetCoruByIdAsync(request.Id);
                if (coru == null) throw new NotFoundException("Coru Not Found");
                _audioPlayer.Play(Path.Combine(config["BaseStoragePath"], coru.StreamUrl));
                return true;

            }
        }
    }
}
