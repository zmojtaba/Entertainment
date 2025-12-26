using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Story;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Story.AudioStoryFeature
{
    public class DeleteAudioStoryHandler
    {
        public record DeleteAudioStoryCommand(Guid Id) : ICommand;
        public class DeleteAudioStoryCommandHandler(IStoryRepository storyRepo, IMediaService mediaService) : ICommandHandler<DeleteAudioStoryCommand>
        {
            public async Task<Unit> Handle(DeleteAudioStoryCommand command, CancellationToken cancellationToken)
            {
                if (command.Id == null) throw new BadRequestException("Audio Story Id is required");
                AudioStory audioStory = await storyRepo.GetAudioStoryByIdAsync(command.Id);
                if (audioStory == null) throw new NotFoundException("Audio Story not found");
                await mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(audioStory.PosterImageUrl), true);
                await storyRepo.DeleteAudioStoryAsync(audioStory);
                return Unit.Value;
            }
        }
    }
}
