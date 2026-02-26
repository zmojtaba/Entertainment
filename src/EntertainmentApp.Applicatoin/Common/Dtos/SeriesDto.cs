using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Common.Dtos
{

    public class EpisodeDto
    {
        public Guid Id { get; set; }
        public int EpisodeNumber { get; set; }
        public string StreamUrl { get; set; }
        public string SubtitleUrl { get; set; }
    }
    public class SeasonDto
    {
        public Guid Id { get; set; }
        public int SeasonNumber { get; set; }
        public List<EpisodeDto> Episodes { get; set; } = new();
    }
    public class SeriesDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal ImdbRating { get; set; }
        public int PublishedDate { get; set; }
        public List<string> Language { get; set; }
        public List<string> Countries { get; set; }
        public int AgeGroup { get; set; }
        public string PosterImageUrl { get; set; }

        public List<SeasonDto> Seasons { get; set; } = new();

        public List<string> Genres { get; set; }
        public List<DirectorDto> Directors { get; set; } = new();
        public List<ActorDto> Actors { get; set; } = new();
    }
}
