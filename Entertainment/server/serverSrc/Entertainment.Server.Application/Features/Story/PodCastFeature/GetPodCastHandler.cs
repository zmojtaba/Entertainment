namespace Entertainment.Server.Applicatoin.Features.Story.PodCastFeature
{
    public record GetPodCastsQuery(string? language, string? genre) : IQuery<List<PodCastDto>>;
    public class GetPodCastHandler(IStoryRepository storyRepo) : IQueryHandler<GetPodCastsQuery, List<PodCastDto>>
    {
        public async Task<List<PodCastDto>> Handle(GetPodCastsQuery request, CancellationToken cancellationToken)
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
                throw new NotFoundException("Podcast Not found");

            List<PodCastDto> result = podcasts.Select(m => m.ToPodCastDto()).ToList();

            return result;
        }
    }
}

