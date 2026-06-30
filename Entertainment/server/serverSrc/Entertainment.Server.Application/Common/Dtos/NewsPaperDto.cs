namespace Entertainment.Server.Applicatoin.Common.Dtos
{
    public class NewsPaperDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public long PublishedDate { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        public string StreamUrl { get; set; } = string.Empty;
        public string PosterImageUrl { get; set; } = string.Empty;
        public List<string> Genres { get; set; } = new ();
        public PublisherDto? Publisher { get; set; }
    }

    public class PublisherDto
    {
        public string Name { get; set; } = string.Empty;
        public string? ImagePath { get; set; } = string.Empty;
    }

    public class MagazineDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public long PublishedDate { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        public string StreamUrl { get; set; } = string.Empty;
        public string PosterImageUrl { get; set; } = string.Empty;
        public List<string> Genres { get; set; } = new();
        public PublisherDto? Publisher { get; set; }
    }

}
