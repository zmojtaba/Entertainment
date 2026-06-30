namespace EntertainmentApp.Application.Common.Models
{
    public class DatabaseSyncedResult
    {
        public DatabaseCategorySyncedResult Movies { get; set; }
        public DatabaseCategorySyncedResult Series { get; set; }
        public DatabaseCategorySyncedResult Corus { get; set; }
        public DatabaseCategorySyncedResult Tracks { get; set; }
        public DatabaseCategorySyncedResult Albums { get; set; }
        public DatabaseCategorySyncedResult Magazines { get; set; }
        public DatabaseCategorySyncedResult NewsPapers { get; set; }
        public DatabaseCategorySyncedResult AudioStories { get; set; }
        public DatabaseCategorySyncedResult Books { get; set; }
        public DatabaseCategorySyncedResult PodCasts { get; set; }

    }

    public class DatabaseCategorySyncedResult
    {
        public List<object> Added { get; set; } = new List<object>();
        public List<object> Deleted { get; set; } = new();

    }
}
