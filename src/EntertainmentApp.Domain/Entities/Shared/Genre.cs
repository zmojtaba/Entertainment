
using EntertainmentApp.Domain.Entities.Music;
using EntertainmentApp.Domain.Entities.Publication;
using EntertainmentApp.Domain.Entities.Story;
using System.Globalization;
using System.Numerics;
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
        public List<Track> Tracks { get; private set; } = new List<Track>();
        public List<Album> Albums { get; private set; } = new List<Album>();
        public List<AudioStory> AudioStories { get; private set; } = new List<AudioStory>();
        public List<Magazine> Magazines { get; private set; } = new List<Magazine>();
        public List<NewsPaper> NewsPapers { get; private set; } = new List<NewsPaper>();
        public List<string>? Categories { get; private set; } = new();

        private Genre() { } // For EF Core
        public Genre(string title)
        {
            Title = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(title.Trim());
        }
        public void AddCategory(string category)
        {
            if (string.IsNullOrWhiteSpace(category))
                throw new DomainException("category can not be empty");

            var normalized = CultureInfo.CurrentCulture.TextInfo
                .ToTitleCase(category.Trim());

            if (!Categories.Contains(normalized))
                Categories.Add(normalized);
        }
    }
}
