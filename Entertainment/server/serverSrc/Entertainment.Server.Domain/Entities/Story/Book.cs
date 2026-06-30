using System.Globalization;

namespace Entertainment.Server.Domain.Entities.Story
{
    public class Book : BaseEntity
    {
        public string Title { get; private set; } = string.Empty;
        public string Description { get; private set; } = string.Empty;
        public List<string> Languages { get; private set; } = new List<string>();
        public int AgeGroup { get; private set; } = default;
        public decimal Rating { get; private set; } = default;
        public int PublishedDate { get; private set; } = default;
        public string StreamUrl { get; private set; } = string.Empty;
        public string PosterImageUrl { get; private set; } = string.Empty;
        public List<Genre> Genres { get; private set; } = new List<Genre>();
        public List<Writer> Writers { get; private set; } = new List<Writer>();

        private Book() { }

        public Book(string title, string description, List<string> languages, int ageGroup, decimal rating, int publishedDate, string streamUrl, string posterImageUrl)
        {
            SetTitle(title);
            SetDescription(description);
            SetLanguages(languages);
            SetAgeGroup(ageGroup);
            SetRating(rating);
            SetPublishedDate(publishedDate);
            SetStreamUrl(streamUrl);
            SetPosterImageUrl(posterImageUrl);
        }


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

        public void SetAgeGroup(int ageGroup)
        {
            if (ageGroup <= 0)
                throw new DomainException("Age group must be greater than zero.");

            AgeGroup = ageGroup;
        }

        public void SetRating(decimal rating)
        {
            if (rating < 0 || rating > 10)
                throw new DomainException("IMDb rating must be between 0 and 10.");

            Rating = rating;
        }

        public void SetPublishedDate(int publishedDate)
        {
            if (publishedDate <= 0)
                throw new DomainException("Published date must be valid (year > 0).");

            PublishedDate = publishedDate;
        }

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

        public void RemoveWriter() => Writers = new();
        public void AddWriter(Writer writer)
        {
            if (writer == null)
                throw new DomainException("Director cannot be null.");

            Writers.Add(writer);
        }



    }
}
