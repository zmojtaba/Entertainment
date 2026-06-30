using System.Globalization;

namespace Entertainment.Server.Domain.Entities.Publication
{
    public class Publisher : BaseEntity
    {
        public string Name { get; private set; } = string.Empty;
        public string? ImagePath { get; private set; } = string.Empty;
        public List<Magazine> Magazines { get; private set; } = new List<Magazine>();
        public List<NewsPaper> NewsPapers { get; private set; } = new();
        private Publisher() { }
        public Publisher(string name)
        {
            SetName(name);
        }
        public void SetName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new DomainException("Publisher name cannot be empty.");
            Name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(name.Trim());

        }
        public void AddMagazine(Magazine magazine)
        {
            if (magazine == null)
                throw new DomainException("Magazine cannot be null.");
            Magazines.Add(magazine);
        }
        public void AddNewsPaper(NewsPaper newsPaper)
        {
            if (newsPaper == null)
                throw new DomainException("NewsPaper cannot be null.");
            NewsPapers.Add(newsPaper);
        }
    }
}
