namespace EntertainmentApp.Application.Features.Story.AudioStoryFeature
{
    public record DeleteAudioStoryEpisodeCommand(Guid Id) : ICommand;
    public class DeleteAudioStoryEpisodeHandler(IStoryRepository storyRepo, IMediaService mediaService) : ICommandHandler<DeleteAudioStoryEpisodeCommand>
    {
        public async Task<Unit> Handle(DeleteAudioStoryEpisodeCommand command, CancellationToken cancellationToken)
        {
            if (command.Id == null) throw new BadRequestException("Episode Id is Required");
            AudioStoryEpisode episode = await storyRepo.GetAudioStoryEpisodeByIdAsync(command.Id);
            if (episode == null) throw new NotFoundException("Episode not found");

            await mediaService.DeleteFileAsync(episode.StreamUrl, true);
            await storyRepo.DeleteAudioStoryEpisodeAsync(episode);
            return Unit.Value;
        }
    }
}
