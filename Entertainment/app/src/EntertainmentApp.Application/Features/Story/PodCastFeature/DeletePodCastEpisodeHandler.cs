namespace EntertainmentApp.Application.Features.Story.PodCastFeature
{
    public record DeletePodCastEpisodeCommand(Guid Id) : ICommand;
    public class DeletePodCastEpisodeHandler(IStoryRepository storyRepo, IMediaService mediaService) : ICommandHandler<DeletePodCastEpisodeCommand>
    {

        public async Task<Unit> Handle(DeletePodCastEpisodeCommand command, CancellationToken cancellationToken)
        {
            if (command.Id == null) throw new BadRequestException("Episode Id is Required");
            PodCastEpisode episode = await storyRepo.GetPodCastEpisodeByIdAsync(command.Id);
            if (episode == null) throw new NotFoundException("Episode not found");

            await mediaService.DeleteFileAsync(episode.StreamUrl, true);
            await storyRepo.DeletePodCastEpisodeAsync(episode);
            return Unit.Value;
        }
    }
}

