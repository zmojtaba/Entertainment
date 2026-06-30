namespace Entertainment.Server.Applicatoin.Features.Story.AudioStoryFeature
{
        public record GetAudioStoryByIdQuery(Guid Id) : IQuery<AudioStoryDto>;
    public class GetAudioStoryByIdHandler(IStoryRepository storyRepo) : IQueryHandler<GetAudioStoryByIdQuery, AudioStoryDto?>
    {
        public async Task<AudioStoryDto?> Handle(GetAudioStoryByIdQuery request, CancellationToken cancellationToken)
        {
            var audioStory = await storyRepo.GetAudioStoryByIdAsync(request.Id);
            if (audioStory == null)
                throw new NotFoundException("Podcast not found");
            return audioStory.ToAudioStoryDto();
        }
    }
}
