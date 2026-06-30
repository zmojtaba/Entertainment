using System.Globalization;

namespace Entertainment.Server.Domain.Entities.Story
{
    public class Writer : BaseEntity
    {
        public string Name { get; private set; }
        public string? ImagePath { get; private set; } = string.Empty;
        public List<Book> Books { get; private set; }
        private Writer() { }

        public Writer(string name)
        {
            Name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(name.Trim()); ;
        }

    }
}
