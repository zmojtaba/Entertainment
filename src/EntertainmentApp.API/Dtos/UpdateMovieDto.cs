using EntertainmentApp.Domain.Entities.Shared;

namespace EntertainmentApp.API.Dtos
{
    public class UpdateMovieDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string> Languages { get; set; } = new List<string>();
        public List<string> Countries { get; set; } = new List<string>();
        public int AgeGroup { get; set; }
        public decimal ImdbRating { get; set; }
        public int PublishedDate { get; set; }
        public List<string> Genres { get; set; } = new();
        public List<string> Directors { get; set; } = new();
        public List<string> Actors { get; set; } = new();
    }
}
