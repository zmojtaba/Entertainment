namespace EntertainmentApp.Domain.Entities.Video
{
    public class Movie : BaseEntity
    {
        public string Title { get; private set; }
        public string Description { get; private set; }
        public List<string> Languages { get; private set; } = new List<string>();
        public List<string> Countries { get; private set; } = new List<string>();
        public int AgeGroup { get; private set; }
        public decimal ImdbRating { get; private set; }
        public int PublishedDate { get; private set; }


        public Guid MediaId { get; private set; }     // FK
        public Media Media { get; private set; }


        public List<Genre> Genres { get; private set; } = new List<Genre>();
        public List<Director> Directors { get; private set; } = new List<Director>();
        public List<Actor> Actors { get; private set; } = new List<Actor>();


        private Movie() { } // For EF Core
        public Movie(
            string title,
            string description,
            List<string> languages,
            List<string> countries,
            int ageGroup,
            decimal imdbRating,
            int publishedDate)
        {
            SetTitle(title);
            SetDescription(description);
            SetLanguages(languages);
            SetCountries(countries);
            SetAgeGroup(ageGroup);
            SetImdbRating(imdbRating);
            SetPublishedDate(publishedDate);
        }

        // ------------------------------
        // Setters (Encapsulated Changes)
        // ------------------------------

        public void SetTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new DomainException("Title cannot be empty.");

            Title = title.Trim();
        }

        public void SetDescription(string description)
        {
            if (string.IsNullOrWhiteSpace(description))
                throw new DomainException("Description cannot be empty.");

            Description = description.Trim();
        }

        public void SetLanguages(List<string> languages)
        {
            if (languages == null || !languages.Any())
                throw new DomainException("Languages cannot be empty.");

            Languages = languages;
        }

        public void SetCountries(List<string> countries)
        {
            if (countries == null || !countries.Any())
                throw new DomainException("Countries cannot be empty.");

            Countries = countries;
        }

        public void SetAgeGroup(int ageGroup)
        {
            if (ageGroup <= 0)
                throw new DomainException("Age group must be greater than zero.");

            AgeGroup = ageGroup;
        }

        public void SetImdbRating(decimal rating)
        {
            if (rating < 0 || rating > 10)
                throw new DomainException("IMDb rating must be between 0 and 10.");

            ImdbRating = rating;
        }

        public void SetPublishedDate(int publishedDate)
        {
            if (publishedDate <= 0)
                throw new DomainException("Published date must be valid (year > 0).");

            PublishedDate = publishedDate;
        }

        // ------------------------------
        // Media Relationship
        // ------------------------------
        public void SetMedia(Media media)
        {
            if (media == null)
                throw new DomainException("Media cannot be null.");

            Media = media;
            MediaId = media.Id;
        }

        // ------------------------------
        // Add/Remove Logic
        // ------------------------------

        public void AddGenre(Genre genre)
        {
            if (genre == null)
                throw new DomainException("Genre cannot be null.");

            Genres.Add(genre);
        }

        public void AddDirector(Director director)
        {
            if (director == null)
                throw new DomainException("Director cannot be null.");

            Directors.Add(director);
        }

        public void AddActor(Actor actor)
        {
            if (actor == null)
                throw new DomainException("Actor cannot be null.");

            Actors.Add(actor);
        }

    }
}
