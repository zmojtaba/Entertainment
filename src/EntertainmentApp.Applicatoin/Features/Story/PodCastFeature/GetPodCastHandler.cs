using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Story;

namespace EntertainmentApp.Applicatoin.Features.Story.PodCastFeature
{
    public class GetPodCastHandler
    {
        public record GetPodCastQuery(string? language, string? genre) : IQuery<List<PodCastDto>>;
        public class GetPodCastQueryHandler(IStoryRepository storyRepo) : IQueryHandler<GetPodCastQuery, List<PodCastDto>>
        {
            
            
            public async Task<List<PodCastDto>> Handle(GetPodCastQuery request, CancellationToken cancellationToken)
            {
                List<PodCast> podcasts = null;
                if (!string.IsNullOrEmpty(request.language) && string.IsNullOrEmpty(request.genre))
                    podcasts = await storyRepo.GetPodCastByLanguage(request.language);
                else if (!string.IsNullOrEmpty(request.language) && !string.IsNullOrEmpty(request.genre))
                    podcasts = await storyRepo.GetPodCastByFilterAsync(request.language, request.genre);
                else if (string.IsNullOrEmpty(request.language) && !string.IsNullOrEmpty(request.genre))
                    podcasts = await storyRepo.GetPodCastByGenre(request.genre);
                else podcasts = await storyRepo.GetPodCastsAsync();

                if (podcasts == null || !podcasts.Any())
                    throw new NotFoundException("Movie Not found");

                List<PodCastDto> result = podcasts.Select(m => m.ToPodCastDto()).ToList();

                return result;
            }
        }
    }
}
