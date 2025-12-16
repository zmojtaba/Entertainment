namespace EntertainmentApp.Domain.Entities.Video
{
    public class Episode : BaseEntity
    {
        public int EpisodeNumber { get;  set; }
        public string StreamUrl { get;  set; }
        public Guid? SeasonId { get;  set; }
        public Season? Season { get;  set; }
        private Episode() { } // For EF Core
        public Episode(int episodeNumber, string streamUrl)
        {
            SetEpisodeNumber(episodeNumber);
            SetStreamUrl(streamUrl);
        }


        // ------------------------------
        // Setters (Encapsulated Changes)
        // ------------------------------
        public void SetSeason(Season season)
        {
            if (season == null)
                throw new DomainException("Season cannot be empty.");
            Season = season;
            SeasonId = season.Id;
        }
        public void SetEpisodeNumber(int episodeNumber)
        {
            if (episodeNumber <= 0)
                throw new DomainException("Episode number must be greater than zero.");
            EpisodeNumber = episodeNumber;
        }
        public void SetStreamUrl(string streamUrl)
        {
            if (string.IsNullOrWhiteSpace(streamUrl))
                throw new DomainException("Stream URL cannot be empty.");
            StreamUrl = streamUrl.Trim();
        }


    }
}
