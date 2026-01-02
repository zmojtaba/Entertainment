using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Music;

namespace EntertainmentApp.Applicatoin.Features.Music.TrackFeatur
{
    public record DeleteTrackCommand(Guid Id) : ICommand;
    public class DeleteTrackHandler : ICommandHandler<DeleteTrackCommand>
    {
        private readonly IMusicRepository _musicRepository;
        private readonly IMediaService _mediaService;
        public DeleteTrackHandler(IMusicRepository musicRepository, IMediaService mediaService)
        {
            _musicRepository = musicRepository;
            _mediaService = mediaService;
        }
        public async Task<Unit> Handle(DeleteTrackCommand command, CancellationToken cancellationToken)
        {
            Track? track = await _musicRepository.GetTrackByIdAsync(command.Id);
            if (track == null) throw new NotFoundException("Track not found");
            // Delete associated media files
            await _mediaService.DeleteFileAsync(track.StreamUrl, true);
            await _mediaService.DeleteFileAsync(track.PosterImageUrl, true);
            await _musicRepository.DeleteTrackAsync(track);
            return Unit.Value;
        }
    }
}
