using EntertainmentApp.Domain.Entities.Story;
using System.Globalization;

namespace EntertainmentApp.Domain.Entities.Music
{
    public class Album : BaseEntity
    {
        public string Title { get; private set; } = string.Empty;
        public List<string> Languages { get; private set; } = new List<string>();
        public string PosterImageUrl { get; private set; } = string.Empty;
        public List<Genre> Genres { get; private set; } = new List<Genre>();
        public Singer Singer { get; private set; } 
        public Guid SingerId { get; private set; }
        public List<AlbumEpisode> Episodes { get; private set; } = new List<AlbumEpisode>();


        private Album() { }
        public Album(string title, List<string> languages, string posterImageUrl)
        {
            SetTitle(title);
            SetLanguages(languages);
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
        public void SetLanguages(List<string> languages)
        {
            if (languages == null || languages.Count == 0)
                throw new DomainException("Languages cannot be empty.");
            Languages = languages;
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

        public void SetSinger(Singer singer)
        {
            if (singer == null)
                throw new DomainException("Singer cannot be null.");

            Singer = singer;
            SingerId = singer.Id;
            singer.AddAlbum(this);
        }


        public void AddEpisode(AlbumEpisode episode)
        {
            if (episode == null)
                throw new DomainException("Episode cannot be null.");
            Episodes.Add(episode);
            episode.SetAlbum(this);
        }
    }
}
