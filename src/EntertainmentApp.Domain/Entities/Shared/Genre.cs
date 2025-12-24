
using EntertainmentApp.Domain.Entities.Story;
using System.Globalization;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace EntertainmentApp.Domain.Entities.Shared
{
    public class Genre : BaseEntity
    {
        public string Title { get; private set; }
        public List<Movie>? Movies { get; private set; } = new List<Movie>();
        public List<Series>? Series { get; private set; } = new List<Series>();
        public List<Book>? Books { get; private set; } = new List<Book>();
        public List<PodCast> PodCasts { get; private set; } = new List<PodCast>();
        private Genre() { } // For EF Core
        public Genre(string title)
        {
            Title = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(title.Trim());
        }
    }
}
