using EntertainmentApp.Domain.Entities.Shared;
using System.Globalization;


namespace EntertainmentApp.Domain.Entities.Music
{
    public class Singer : BaseEntity
    {
        public string Name { get; private set; }
        public string? ImagePath { get; private set; } = string.Empty;
        public List<Track> Tracks { get; private set; } = new();
        public List<Album> Albums { get; private set; } = new();
        private Singer() { }


        public Singer(string name)
        {
            Name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(name.Trim()); ;
        }
        public void RemoveTracks()
        {
            Tracks = new();
        }

        public void AddTrack(Track track)
        {
            if (track == null)
                throw new DomainException("Genre cannot be null.");

            Tracks.Add(track);
        }

        public void RemoveAlbum()
        {
            Albums = new();
        }

        public void AddAlbum(Album album)
        {
            if (album == null)
                throw new DomainException("Genre cannot be null.");

            Albums.Add(album);
        }
    }
}
