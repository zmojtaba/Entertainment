using EntertainmentApp.Domain.Entities.Exceptions;

namespace EntertainmentApp.Domain.Entities.Movie
{
    public class Movie : BaseEntity
    {
        public string Title { get; private set; }
        public long PublishedDate { get; private set; }
        public string Genre { get; private set; }
        public string Description { get; private set; }
        public string Language { get; private set; }
        public int AgeGroup { get; private set; }
        public string Director { get; private set; }
        public List<string> ImageUrls { get; private set; }
        public string MoviePath { get; private set; }
        public decimal IMDBPoint { get; private set; }


        private Movie() { } // For EF Core
        public Movie(string title, long publishedDate, string genre, string description, string language, int ageGroup, string director, List<string> imageUrls, string moviePath, decimal imdbPoint )
        {
            ValidateMovie(title, publishedDate, genre, description, language, ageGroup, director, imageUrls, moviePath, imdbPoint);
            Title = title;
            PublishedDate = publishedDate;
            Genre = genre;
            Description = description;
            Language = language;
            AgeGroup = ageGroup;
            Director = director;
            ImageUrls = imageUrls;
            MoviePath = moviePath;
            IMDBPoint = imdbPoint;
        }

        private static void ValidateMovie(string title, long publishYear, string genre, string description, string language, int ageGroup, string director, List<string> imageUrls, string moviePath, decimal imdbPoint) {
            if (string.IsNullOrEmpty(title)) throw new DomainException("Title cannot be empty.");
            if (publishYear < 0) throw new DomainException("Time cannot be negetive.");
            //do it later


        }

    }
}
