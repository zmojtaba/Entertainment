namespace EntertainmentApp.Domain.Entities.Video
{
    public class Movie : BaseEntity
    {
        public string Title { get; private set; }
        public string Description { get; private set; }
        public List<Genre> Genres { get; private set; } = new List<Genre>();
        public List<string> Languages { get; private set; } = new List<string>();
        public List<string> Countries { get; private set; } = new List<string>();
        public int AgeGroup { get; private set; }
        public List<Director> Directors { get; private set; } = new List<Director>();
        public List<Actor> Actors { get; private set; } = new List<Actor>();
        public string ImageUrl { get; private set; }
        public string StreamUrl { get; private set; }
        public decimal ImdbRating { get; private set; }
        public long PublishedDate { get; private set; }


        private Movie() { } // For EF Core
        public Movie(string title, long publishedDate, string description, List<string> language, int ageGroup, string imageUrl, string moviePath, decimal imdbPoint)
        {
            ValidateMovie(title, publishedDate, description, language, ageGroup, imageUrl, moviePath, imdbPoint);
            Title = title;
            PublishedDate = publishedDate;
            Description = description;
            Languages = language;
            AgeGroup = ageGroup;
            ImageUrl = imageUrl;
            StreamUrl = moviePath;
            ImdbRating = imdbPoint;
        }

        private static void ValidateMovie(string title, long publishYear, string description, List<string> language, int ageGroup, string imageUrl, string moviePath, decimal imdbPoint)
        {
            if (string.IsNullOrEmpty(title)) throw new DomainException("Title cannot be empty.");
            if (publishYear < 0) throw new DomainException("Time cannot be negetive.");
            //do it later


        }

    }
}
