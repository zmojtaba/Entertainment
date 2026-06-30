namespace EntertainmentApp.Application.Features.Story.AudioStoryFeature
{
    public record GetAudioStoryQuery(string? language, string? genre) : IQuery<List<AudioStoryDto>>;
    public class GetAudioStoryHandler(IStoryRepository storyRepo) : IQueryHandler<GetAudioStoryQuery, List<AudioStoryDto>>
    {
        public async Task<List<AudioStoryDto>> Handle(GetAudioStoryQuery request, CancellationToken cancellationToken)
        {
            List<AudioStory> audioStories = null;
            if (!string.IsNullOrEmpty(request.language) && string.IsNullOrEmpty(request.genre))
                audioStories = await storyRepo.GetAudioStoryByLanguage(request.language);
            else if (!string.IsNullOrEmpty(request.language) && !string.IsNullOrEmpty(request.genre))
                audioStories = await storyRepo.GetAudioStoryByFilterAsync(request.language, request.genre);
            else if (string.IsNullOrEmpty(request.language) && !string.IsNullOrEmpty(request.genre))
                audioStories = await storyRepo.GetAudioStoryByGenre(request.genre);
            else audioStories = await storyRepo.GetAudioStoryAsync();

            if (audioStories == null || !audioStories.Any())
                throw new NotFoundException("Audio Story Not found");
 

            return audioStories.Select(m => m.ToAudioStoryDto()).ToList(); ;
        }
    }
}
