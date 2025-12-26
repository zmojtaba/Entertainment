using EntertainmentApp.Domain.Entities.Story;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Domain.Entities.Music
{
    public class AlbumEpisode : BaseEntity
    {
        public string Title { get; private set; }
        public string StreamUrl { get; private set; }
        public Guid? AlbumId { get; set; }
        public Album? Album { get; set; }
        private AlbumEpisode() { }
        public AlbumEpisode(string title, string streamUrl)
        {
            SetTitle(title);
            SetStreamUrl(streamUrl);
        }

        public AlbumEpisode(string title, string streamUrl, Album album)
        {
            SetTitle(title);
            SetStreamUrl(streamUrl);
            SetAlbum(album);
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
        public void SetStreamUrl(string streamUrl)
        {
            if (string.IsNullOrWhiteSpace(streamUrl))
                throw new DomainException("Stream URL cannot be empty.");
            StreamUrl = streamUrl;
        }

        public void SetAlbum(Album album)
        {
            if (album == null)
                throw new DomainException("Track cannot be empty.");
            Album = album;
            AlbumId = album.Id;
        }
    }
}
