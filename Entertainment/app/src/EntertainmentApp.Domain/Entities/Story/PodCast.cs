namespace EntertainmentApp.Domain.Entities.Story
{
    public class PodCast : BaseEntity
    {
        public string Title { get; private set; } = string.Empty;
        public string Description { get; private set; } = string.Empty;
        public List<string> Languages { get; private set; } = new List<string>();
        public int AgeGroup { get; private set; } = default;
        public string PosterImageUrl { get; private set; } = string.Empty;
        public List<Genre> Genres { get; private set; } = new List<Genre>();
        public List<Speaker> Speakers { get; private set; } =new();
        public List<PodCastEpisode> Episodes { get; private set; } = new List<PodCastEpisode>();


        private PodCast() { }
        public PodCast(string title, string description, List<string> languages, int ageGroup, string posterImageUrl)
        {
            SetTitle(title);
            SetDescription(description);
            SetLanguages(languages);
            SetAgeGroup(ageGroup);
            SetPosterImageUrl(posterImageUrl);
        }
        // ------------------------------
        // Setters (Encapsulated Changes)
        // ------------------------------
        public void SetTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new DomainException("Title cannot be empty.");
            Title = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(title.Trim());
        }
        public void SetDescription(string description)
        {
            if (string.IsNullOrWhiteSpace(description))
                throw new DomainException("Description cannot be empty.");
            Description = description.Trim();
        }
        public void SetLanguages(List<string> languages)
        {
            if (languages == null || languages.Count == 0)
                throw new DomainException("Languages cannot be empty.");
            Languages = languages;
        }
        public void SetAgeGroup(int ageGroup)
        {
            if (ageGroup < 0)
                throw new DomainException("Age group cannot be negative.");
            AgeGroup = ageGroup;
        }
        public void SetPosterImageUrl(string posterImageUrl)
        {
            if (string.IsNullOrWhiteSpace(posterImageUrl))
                throw new DomainException("Poster image URL cannot be empty.");
            PosterImageUrl = posterImageUrl.Trim();
        }


        public void RemoveGenres()
        {
            Genres = new();
        }
        public bool RemoveGenre(Genre genre)
        {
            Genres.Remove(genre);
            return Genres.Count() == 0;
        }
        public void AddGenre(Genre genre)
        {
            if (genre == null)
                throw new DomainException("Genre cannot be null.");

            Genres.Add(genre);
        }

        public void RemoveSpeaker()
        {
            Speakers = new();
        }

        public void AddSpeaker(Speaker speaker)
        {
            if (speaker == null)
                throw new DomainException("Speaker cannot be null.");

            Speakers.Add(speaker);
        }


        public void AddEpisode(PodCastEpisode episode)
        {
            if (episode == null)
                throw new DomainException("Episode cannot be null.");
            Episodes.Add(episode);
            episode.SetPodCast(this);
        }



    }
}
