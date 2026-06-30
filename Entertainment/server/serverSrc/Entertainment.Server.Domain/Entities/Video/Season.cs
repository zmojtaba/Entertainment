namespace Entertainment.Server.Domain.Entities.Video
{
    public class Season : BaseEntity
    {
        public int SeasonNumber { get;  set; }
        public Guid? SeriesId { get;  set; }
        public Series? Series { get;  set; }
        public List<Episode> Episodes { get;  set; } = new List<Episode>();


        private Season() { } // For EF Core
        public Season(int seasonNumber)
        {
            SetSeasonNumber(seasonNumber);
            
        }
        //public Season(int seasonNumber, Series series, List<Episode> episodes)
        //{
        //    SetSeasonNumber(seasonNumber);
        //    SetSeries(series);
        //    SetEpisodes(episodes);
        //}

        // ------------------------------
        // Setters (Encapsulated Changes)
        // ------------------------------

        public void SetSeries(Series series)
        {
            Series = series ?? throw new DomainException("Series cannot be null");
            SeriesId = series.Id;
        }

        public void SetSeasonNumber(int seasonNumber)
        {
            if (seasonNumber <= 0)
                throw new DomainException("Season number must be greater than zero.");
            SeasonNumber = seasonNumber;
        }
        public void SetEpisodes(List<Episode> episodes)
        {
            if (episodes == null || !episodes.Any())
                throw new DomainException("Episodes list cannot be empty.");
            Episodes = episodes;
        }

        public void AddEpisode(Episode episode)
        {
            if (episode == null)
                throw new DomainException("Episode cannot be null.");
            Episodes.Add(episode);
            episode.SetSeason(this);
        }


    }
}
