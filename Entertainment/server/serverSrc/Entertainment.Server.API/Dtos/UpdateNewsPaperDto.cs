namespace Entertainment.Server.API.Dtos
{
    public class UpdateNewsPaperDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public long PublishedDate { get; set; }
        public List<string> Languages { get; set; } = new List<string>();
        public IFormFile? PosterImageFile { get; set; } = null;
        public List<string> Genres { get; set; } = new List<string>();
        public string Publisher { get; set; }
    }
}
