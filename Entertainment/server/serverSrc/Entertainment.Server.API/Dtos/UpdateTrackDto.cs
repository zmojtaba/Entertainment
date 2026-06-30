namespace Entertainment.Server.API.Dtos
{
    public class UpdateTrackDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public IFormFile? PosterImageFile { get; set; } = null;
        public List<string> Genres { get; set; } = new List<string>();
        public string Singer { get; set; } 
    }
}
