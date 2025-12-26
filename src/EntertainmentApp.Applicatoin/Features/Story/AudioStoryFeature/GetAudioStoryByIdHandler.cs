using EntertainmentApp.Applicatoin.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Story.AudioStoryFeature
{
    public class GetAudioStoryByIdHandler
    {
        public record GetAudioStoryByIdQuery(Guid Id) : IQuery<AudioStoryDto>;
        public class GetPodCastByIdQueryHandler(IStoryRepository storyRepo) : IQueryHandler<GetAudioStoryByIdQuery, AudioStoryDto?>
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
}
