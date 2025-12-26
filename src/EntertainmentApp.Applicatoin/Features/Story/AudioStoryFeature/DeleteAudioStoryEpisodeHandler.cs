using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Story;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Story.AudioStoryFeature
{
    public class DeleteAudioStoryEpisodeHandler
    {
        public record DeleteAudioStoryEpisodeCommand(Guid Id) : ICommand;
        public class DeletePodCastEpisodeCommandHandler(IStoryRepository storyRepo, IMediaService mediaService) : ICommandHandler<DeleteAudioStoryEpisodeCommand>
        {
            public async Task<Unit> Handle(DeleteAudioStoryEpisodeCommand command, CancellationToken cancellationToken)
            {
                if (command.Id == null) throw new BadRequestException("Episode Id is Required");
                AudioStoryEpisode episode = await storyRepo.GetAudioStoryEpisodeByIdAsync(command.Id);
                if (episode == null) throw new NotFoundException("Episode not found");

                await mediaService.DeleteMediaFilesAsync(episode.StreamUrl, "", true);
                await storyRepo.DeleteAudioStoryEpisodeAsync(episode);
                return Unit.Value;
            }
        }
    }
}
