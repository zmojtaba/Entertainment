namespace EntertainmentApp.API.Dtos
{


    public class CreateSeriesDto
    {
        public string Title { get;  set; }
        public string Description { get;  set; }
        public List<string> Languages { get;  set; } = new();
        public List<string> Countries { get; set; } = new();
        public int AgeGroup { get;  set; }
        public decimal ImdbRating { get; set; }
        public int PublishedDate { get; set; }
        public IFormFile PosterImageFile { get; set; }
        public string PosterImageUrl { get; set; } = string.Empty;
        

        public List<string> Genres { get;  set; } = new();
        public List<string> Directors { get;  set; } = new();
        public List<string> Actors { get;  set; } = new();
    }
}
