using EntertainmentApp.Domain.Entities.Story;
using System.Globalization;

namespace EntertainmentApp.Domain.Entities.Music
{
    public class Track : BaseEntity
    {
        public string Title { get; private set; } = string.Empty;
        public List<string> Languages { get; private set; } = new List<string>();
        public string StreamUrl { get; private set; } = string.Empty;
        public string PosterImageUrl { get; private set; } = string.Empty;
        public List<Genre> Genres { get; private set; } = new List<Genre>();
        public Singer? Singer { get; private set; }
        public Guid SingerId { get; private set; }

        private Track() { }

        public Track(string title, List<string> languages, string streamUrl, string posterImageUrl)
        {
            SetTitle(title);
            SetLanguages(languages);
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

        public void SetSinger(Singer singer)
        {
            if (singer == null)
                throw new DomainException("Director cannot be null.");

            Singer = singer;
            SingerId = singer.Id;
            singer.AddTrack(this);
        }

    }
}
