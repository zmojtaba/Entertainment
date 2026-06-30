namespace Entertainment.Server.API.Dtos
{
    public class UpdateBookDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string> Languages { get; set; } = new List<string>();
        public int AgeGroup { get; set; }
        public decimal Rating { get; set; }
        public int PublishedDate { get; set; }
        public List<string> Genres { get; set; } = new();
        public List<string> Writers { get; set; } = new();
    }
}
