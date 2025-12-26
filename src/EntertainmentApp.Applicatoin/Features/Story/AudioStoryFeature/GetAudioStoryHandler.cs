using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Story;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Story.AudioStoryFeature
{
    public class GetAudioStoryHandler
    {

        public record GetAudioStoryQuery(string? language, string? genre) : IQuery<List<AudioStoryDto>>;
        public class GetPodCastQueryHandler(IStoryRepository storyRepo) : IQueryHandler<GetAudioStoryQuery, List<AudioStoryDto>>
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
}
