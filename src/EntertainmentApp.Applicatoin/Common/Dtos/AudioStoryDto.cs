using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Common.Dtos
{
    public class AudioStoryDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new();
        public int AgeGroup { get; set; } = default;
        public string PosterImageUrl { get; set; } = string.Empty;
        public List<GenreDto> Genres { get; set; } = new();
        public List<SpeakerDto> Speakers { get; set; } = new();
        public List<AudioStoryEpisodeDto> Episodes { get; set; } = new();
    }

    public class AudioStoryEpisodeDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string StreamUrl { get; set; } = string.Empty;
    }
}
