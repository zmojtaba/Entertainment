namespace Entertainment.Server.API.Dtos
{
    public class AddPodCastDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public int AgeGroup { get; set; }
        public IFormFile PosterImageFile { get; set; }
        public List<string> Genres { get; set; } = new List<string>();
        public List<string> Speakers { get; set; } = new List<string>();
    }
}
