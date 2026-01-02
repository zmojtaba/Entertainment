using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Music;

namespace EntertainmentApp.Applicatoin.Features.Music.AlbumFeature
{
    public record DeleteAlbumCommand(Guid Id) : ICommand;
    public class DeleteAlbumHandler : ICommandHandler<DeleteAlbumCommand>
    {
        private readonly IMusicRepository _musicRepository;
        private readonly IMediaService _mediaService;
        public DeleteAlbumHandler(IMusicRepository musicRepository, IMediaService mediaService)
        {
            _musicRepository = musicRepository;
            _mediaService = mediaService;
        }
        public async Task<Unit> Handle(DeleteAlbumCommand command, CancellationToken cancellationToken)
        {
            Album? album = await _musicRepository.GetAlbumByIdAsync(command.Id);
            if (album == null) throw new NotFoundException("Album not found");
            await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(album.PosterImageUrl), true);
            await _musicRepository.DeleteAlbumAsync(album);
            return Unit.Value;
        }
    }
}
