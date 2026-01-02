using System.Globalization;

namespace EntertainmentApp.Domain.Entities.Publication
{
    public class NewsPaper : BaseEntity
    {
        public string Title { get; private set; } = string.Empty;
        public List<string> Languages { get; private set; } = new List<string>();
        public long PublishedDate { get; private set; } =  DateTimeOffset.UtcNow.ToUnixTimeSeconds(); 
        public string StreamUrl { get; private set; } = string.Empty;
        public string PosterImageUrl { get; private set; } = string.Empty;
        public List<Genre> Genres { get; private set; } = new List<Genre>();
        public Publisher? Publisher { get; private set; }
        public Guid? PublisherId { get; private set; } = new();

        private NewsPaper() { }

        public NewsPaper(string title, List<string> languages, long publishedDate, string streamUrl, string posterImageUrl)
        {
            SetTitle(title);
            SetLanguages(languages);
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

        public void SetLanguages(List<string> languages)
        {
            if (languages == null || !languages.Any())
                throw new DomainException("Languages cannot be empty.");

            Languages = languages;
        }
        public void SetPublishedDate(long publishedDate)
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

        public void AddGenre(Genre genre)
        {
            if (genre == null)
                throw new DomainException("Genre cannot be null.");

            Genres.Add(genre);
        }

        public void SetPublisher(Publisher publisher)
        {
            if (publisher == null)
                throw new DomainException("Director cannot be null.");

            Publisher = publisher;
            PublisherId = publisher.Id;
            publisher.AddNewsPaper(this);
        }
    }
}
