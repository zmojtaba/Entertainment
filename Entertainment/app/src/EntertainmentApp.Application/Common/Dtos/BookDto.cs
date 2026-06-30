namespace EntertainmentApp.Application.Common.Dtos
{
    public class BookDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Rating { get; set; }
        public int PublishedDate { get; set; }
        public List<string> Languages { get; set; }
        public int AgeGroup { get; set; }
        public string StreamUrl { get; set; }
        public string PosterImageUrl { get; set; }
        public List<string> Genres { get; set; }
        public List<WriterDto> Writers { get; set; } = new();
    }

    public class WriterDto
    {
        public string Name { get; set; }
        public string? ImagePath { get; set; } = string.Empty;

    }
}
