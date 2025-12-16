namespace EntertainmentApp.Applicatoin.Common.Models
{
    public class MediaUploadResult
    {
        // File Paths (saved on disk)
        public string Title { get;  set; }
        public string Description { get;  set; } = string.Empty;
        public List<string> Genres { get;  set; }
        public List<string> Languages { get;  set; }
        public List<string> Countries { get; set; }
        public int AgeGroup { get;  set; }
        public List<string> Directors { get;  set; } = new List<string>();
        public List<string> Actors { get;  set; } = new List<string>();
        public decimal ImdbRating { get;  set; }
        public int PublishedDate { get; set; }
        public string TempPosterImageUrl { get;  set; }
        public string PosterImageFileName { get; set; }
        public string TempStreamUrl { get;  set; }
        public string StreamFileName { get; set; }

        public int SeasonNumber { get; set; }
        public int EpisodeNumber { get; set; }
        public Guid SeriesId { get; set; }


    }
}
