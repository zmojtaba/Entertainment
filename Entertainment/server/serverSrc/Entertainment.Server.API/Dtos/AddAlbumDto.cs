namespace Entertainment.Server.API.Dtos
{
    public class AddAlbumDto
    {
        public string Title { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public IFormFile PosterImageFile { get; set; }
        public List<string> Genres { get; set; } = new List<string>();
        public string Singer { get; set; } =  string.Empty;
    }
}
