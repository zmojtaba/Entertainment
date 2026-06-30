using Entertainment.Server.Domain.Entities.Story;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entertainment.Server.Applicatoin.Common.Mappers
{
    public static class AudioStoryMapper
    {
        public static AudioStoryDto ToAudioStoryDto(this AudioStory audioStory)
        {
            return new AudioStoryDto
            {
                Id = audioStory.Id,
                Title = audioStory.Title,
                Description = audioStory.Description,
                Languages = audioStory.Languages,
                AgeGroup = audioStory.AgeGroup,
                PosterImageUrl = audioStory.PosterImageUrl,
                Genres = audioStory.Genres.Select(g => g.Title).ToList(),
                Speakers = audioStory.Speakers.Select(s => s.ToSpeaker()).ToList(),
                Episodes = audioStory.Episodes.Select(e => e.ToPodCastEpisodeDto()).ToList()
            };
        }

        public static AudioStoryEpisodeDto ToPodCastEpisodeDto(this AudioStoryEpisode episode)
        {
            return new AudioStoryEpisodeDto
            {
                Id = episode.Id,
                Title = episode.Title,
                StreamUrl = episode.StreamUrl
            };
        }
    }
}
