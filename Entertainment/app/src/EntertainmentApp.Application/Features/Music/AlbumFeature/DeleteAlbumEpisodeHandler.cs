
using EntertainmentApp.Application.Interfaces;
using EntertainmentApp.Domain.Entities.Music;

namespace EntertainmentApp.Application.Features.Music.AlbumFeature
{
    public record DeleteAlbumEpisodeCommand(Guid Id) : ICommand;
    public class DeleteAlbumEpisodeHandler(IMusicRepository musicRepo, IMediaService mediaService) : ICommandHandler<DeleteAlbumEpisodeCommand>
    {
        public async Task<Unit> Handle(DeleteAlbumEpisodeCommand command, CancellationToken cancellationToken)
        {
            AlbumEpisode episode = await musicRepo.GetAlbumEpisodeByIdAsync(command.Id);
            if (episode == null) throw new NotFoundException("Track not found");
            await mediaService.DeleteFileAsync(episode.StreamUrl, true);
            await musicRepo.DeleteAlbumEpisodeAsync(episode);
            return Unit.Value;
        }
    }
}
