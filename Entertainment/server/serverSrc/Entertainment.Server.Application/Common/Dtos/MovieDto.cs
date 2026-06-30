namespace Entertainment.Server.Applicatoin.Common.Dtos
{

    public class DirectorDto
    {
        public string Name { get;  set; }
        public string? ImagePath { get;  set; } = string.Empty;
    }


    public class ActorDto
    {
        public string Name { get;  set; }
        public string? ImagePath { get; set; }
    }

    public class GenreDto
    {
        public string Title { get; set; }
    }


    public class MovieDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get;  set; }
        public decimal ImdbRating { get;  set; }
        public int PublishedDate { get;  set; }
        public List<string> Languages { get;  set; } 
        public List<string> Countries { get; set; }
        public int AgeGroup { get;  set; }
        public string StreamUrl { get; set; }
        public string PosterImageUrl { get; set; }
        public string? SubtitleUrl { get; set; }
        public List<string> Genres { get;  set; }
        public List<DirectorDto> Directors { get;  set; } = new();
        public List<ActorDto> Actors { get;  set; } = new();


    }
}
