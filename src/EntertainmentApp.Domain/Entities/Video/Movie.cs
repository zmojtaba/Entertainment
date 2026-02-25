using System.Globalization;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

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

        public string StreamUrl { get; private set; }
        public string PosterImageUrl { get; private set; }
        public string SubtitleUrl { get; private set; } = string.Empty;

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
            int publishedDate,
            string streamUrl,
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
            SetStreamUrl(streamUrl);
            SetPosterImageUrl(posterImageUrl);
            //SetSubtitleUrl(subtitleUrl);
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

        // ------------------------------
        // Media Relationship
        // ------------------------------
        public void SetStreamUrl(string streamUrl)
        {
            if (string.IsNullOrWhiteSpace(streamUrl))
                throw new DomainException("Stream url cannot be null.");

            StreamUrl = streamUrl.Trim();
        }

        public void SetPosterImageUrl(string posterImageUrl)
        {
            if (string.IsNullOrWhiteSpace(posterImageUrl))
                throw new DomainException("Poster image url cannot be null");
            PosterImageUrl = posterImageUrl.Trim();
        }

        public void SetSubtitleUrl(string subtitleUrl)
        {
            if (string.IsNullOrWhiteSpace(subtitleUrl)) throw new DomainException("Subtitle url cannot be null");
            SubtitleUrl = subtitleUrl?.Trim();
        }

        // ------------------------------
        // Add/Remove Logic
        // ------------------------------

        public void RemoveGenres()
        {
            Genres = new();
        }

        public void AddGenre(Genre genre)
        {
            if (genre == null)
                throw new DomainException("Genre cannot be null.");

            Genres.Add(genre);
        }


        public void RemoveDirectors() => Directors = new();
        public void AddDirector(Director director)
        {
            if (director == null)
                throw new DomainException("Director cannot be null.");

            Directors.Add(director);
        }

        public void RemoveActors() => Actors = new();
        public void AddActor(Actor actor)
        {
            if (actor == null)
                throw new DomainException("Actor cannot be null.");

            Actors.Add(actor);
        }
    
    }
}
