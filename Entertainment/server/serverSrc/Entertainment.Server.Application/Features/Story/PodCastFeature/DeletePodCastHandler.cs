namespace Entertainment.Server.Applicatoin.Features.Story.PodCastFeature
{
    public record DeletePodCastCommand(Guid Id) : ICommand;
    public class DeletePodCastHandler(IStoryRepository storyRepo, IMediaService mediaService) : ICommandHandler<DeletePodCastCommand>
    {
        public async Task<Unit> Handle(DeletePodCastCommand command, CancellationToken cancellationToken)
        {
            if (command.Id == null) throw new BadRequestException("Podcast Id is required");
            PodCast podCast = await storyRepo.GetPodCastByIdAsync(command.Id);
            if (podCast == null) throw new NotFoundException("PodCast not found");
            await mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(podCast.PosterImageUrl), true);
            await storyRepo.DeletePodCastAsync(podCast);
            return Unit.Value;
        }
    }
}

