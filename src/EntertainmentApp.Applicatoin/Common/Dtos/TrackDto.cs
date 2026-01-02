using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Common.Dtos
{
    public class TrackDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public List<string> Language { get; set; }
        public string StreamUrl { get; set; }
        public string PosterImageUrl { get; set; }

        public List<string> Genres { get; set; }
        public SingerDto Singer { get; set; }
    }

    public class SingerDto
    {
        public string Name { get; set; }
        public string? ImagePath { get; set; } = string.Empty;
    }
}
