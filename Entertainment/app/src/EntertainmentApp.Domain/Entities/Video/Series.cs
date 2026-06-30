namespace EntertainmentApp.Domain.Entities.Video
{
    public class Series : BaseEntity
    {
        public string Title { get; private set; }
        public string Description { get; private set; }
        public List<string> Languages { get;  set; } = new List<string>();
        public List<string> Countries { get;  set; } = new List<string>();
        public int AgeGroup { get;  set; }
        public decimal ImdbRating { get;  set; }
        public int PublishedDate { get;  set; }
        public string PosterImageUrl { get;  set; }
        public List<Season> Seasons { get;  set; } = new();
        public List<Genre> Genres { get; set; } = new List<Genre>();
        public List<Director> Directors { get; set; } = new List<Director>();
        public List<Actor> Actors { get; set; } = new List<Actor>();

        private Series() { } // For EF Core
        public Series(
            string title,
            string description,
            List<string> languages,
            List<string> countries,
            int ageGroup,
            decimal imdbRating,
            int publishedDate,
            string posterImageUrl
        )
        {
            SetTitle(title);
            SetDescription(description);
            SetLanguages(languages);
            SetCountries(countries);
            SetAgeGroup(ageGroup);
            SetImdbRating(imdbRating);
            SetPublishedDate(publishedDate);
            SetPosterImageUrl(posterImageUrl);
        }

        public Series(
            string title,
            string description,
            List<string> languages,
            List<string> countries,
            int ageGroup,
            decimal imdbRating,
            int publishedDate,
            string posterImageUrl,
            List<Season> seasons
        )
        {
            SetTitle(title);
            SetDescription(description);
            SetLanguages(languages);
            SetCountries(countries);
            SetAgeGroup(ageGroup);
            SetImdbRating(imdbRating);
            SetPublishedDate(publishedDate);
            SetPosterImageUrl(posterImageUrl);
            SetSeasons(seasons);
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

        public void SetPosterImageUrl(string posterImageUrl)
        {
            if (string.IsNullOrWhiteSpace(posterImageUrl))
                throw new DomainException("Poster image url cannot be null");
            PosterImageUrl = posterImageUrl.Trim();
        }

        // ------------------------------
        // Media Relationship
        // ------------------------------
        public void AddSeason(Season season)
        {
            if (season == null)
                throw new DomainException("Stream url cannot be null.");

            Seasons.Add(season);
            season.SetSeries(this);
        }

        public void RemoveSeason(Season season)
        {
            if (season == null)
                throw new DomainException("Stream url cannot be null.");
            Seasons.Remove(season);
        }

        public void RemoveAllSeasons()
        {
            Seasons = new();
        }

        public void SetSeasons(List<Season> seasons)
        {
            if (seasons == null || !seasons.Any())
                throw new DomainException("Seasons cannot be null or empty.");
            Seasons = seasons;
        }


        // ------------------------------
        // Add/Remove Logic
        // ------------------------------

        public void RemoveGenres()
        {
            Genres = new();
        }

        public bool RemoveGenre(Genre genre)
        {
            if (genre == null) throw new DomainException("Genre cannot be null.");
            Genres.Remove(genre);
            return Genres.Count() == 0;
        }

        public void AddGenre(Genre genre)
        {
            if (genre == null)
                throw new DomainException("Genre cannot be null.");

            Genres.Add(genre);
        }

        public void SetGenres(List<Genre> genres)
        {
            if (genres == null || !genres.Any())
                throw new DomainException("Seasons cannot be null or empty.");
            Genres = genres;
        }


        public void RemoveDirectors() => Directors = new();
        public void AddDirector(Director director)
        {
            if (director == null)
                throw new DomainException("Director cannot be null.");

            Directors.Add(director);
        }

        public void SetDirectors(List<Director> director)
        {
            if (director == null || !director.Any())
                throw new DomainException("Seasons cannot be null or empty.");
            Directors = director;
        }


        public void RemoveActors() => Actors = new();
        public void AddActor(Actor actor)
        {
            if (actor == null)
                throw new DomainException("Actor cannot be null.");

            Actors.Add(actor);
        }

        public void SetActors(List<Actor> actors)
        {
            if (actors == null || !actors.Any())
                throw new DomainException("Seasons cannot be null or empty.");
            Actors = actors;
        }


    }
}
