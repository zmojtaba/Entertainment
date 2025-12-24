using EntertainmentApp.Applicatoin.Interfaces;

namespace EntertainmentApp.Applicatoin.Features.Story.PodCastFeature
{
    public class GetPodCastByIdHandler
    {
        public record GetPodCastByIdQuery(Guid Id) : IQuery<PodCastDto?>;
        public class GetPodCastByIdQueryHandler(IStoryRepository storyRepo) : IQueryHandler<GetPodCastByIdQuery, PodCastDto?>
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
}
