namespace EntertainmentApp.Application.Common.Dtos
{
    public class TrackDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public List<string> Languages { get; set; }
        public string StreamUrl { get; set; }
        public string PosterImageUrl { get; set; }

        public List<string> Genres { get; set; }
        public SingerDto Singer { get; set; }
    }

    public class SingerDto
    {
        public string Name { get; set; }
        public string? ImagePath { get; set; } = string.Empty;
    }
}
