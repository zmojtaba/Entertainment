
namespace EntertainmentApp.Domain.Entities.Shared
{
    public class Genre : BaseEntity
    {
        public string Title { get; private set; }
        public List<Movie>? Movies { get; private set; } = new List<Movie>();
        private Genre() { } // For EF Core
        public Genre(string title)
        {
            Title = title;
        }
    }
}
