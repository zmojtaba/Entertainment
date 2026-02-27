using EntertainmentApp.Domain.Entities.Music;
namespace EntertainmentApp.Applicatoin.Common.Dtos
{
    public class AlbumDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public string PosterImageUrl { get; set; } = string.Empty;
        public List<GenreDto> Genres { get; set; } = new();
        public SingerDto Singer { get; set; }
        public List<AlbumEpisodeDto> Episodes { get; set; } = new();
    }

    public class AlbumEpisodeDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string StreamUrl { get; set; } = string.Empty;
    }

    public class SingerAlbumsDto
    {
        public SingerDto Singer { get; set; }
        public List<AlbumDto> Albums { get; set; }
    }
}
