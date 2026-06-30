namespace EntertainmentApp.Application.Features.Story.PodCastFeature
{
    public record GetPodCastByIdQuery(Guid Id) : IQuery<PodCastDto?>;
    public class GetPodCastByIdHandler(IStoryRepository storyRepo) : IQueryHandler<GetPodCastByIdQuery, PodCastDto?>
    {
        public async Task<PodCastDto?> Handle(GetPodCastByIdQuery request, CancellationToken cancellationToken)
        {
            var podcast = await storyRepo.GetPodCastByIdAsync(request.Id);
            if (podcast == null)
                throw new NotFoundException("Podcast not found");
            return podcast.ToPodCastDto();
        }
    }
}

