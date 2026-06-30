using System.Globalization;

namespace EntertainmentApp.Domain.Entities.Shared
{
    public class Director : BaseEntity
    {
        public string Name { get; private set; }
        public string? ImagePath { get; private set; } = string.Empty;
        public List<Movie> Movies { get; private set; } = new List<Movie>();
        public List<Series>? Series { get; private set; } = new List<Series>();
        private Director() { } // For EF Core
        public Director(string name)
        {
            Name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(name.Trim());
        }
    }
}
