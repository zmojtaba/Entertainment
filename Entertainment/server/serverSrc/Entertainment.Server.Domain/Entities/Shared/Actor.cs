using System.Globalization;

namespace Entertainment.Server.Domain.Entities.Shared
{
    public class Actor : BaseEntity
    {
        public string Name { get; private set; }
        public string? ImagePath { get; private set; } = string.Empty;
        public List<Movie> Movies { get; private set; } = new List<Movie>();
        public List<Series>? Series { get; private set; } = new List<Series>();
        private Actor() { } // For EF Core
        public Actor(string name)
        {
            Name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(name.Trim());
        }
    }
}
