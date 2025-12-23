using EntertainmentApp.Domain.Entities.Story;

namespace EntertainmentApp.Applicatoin.Common.Mappers
{
    public static class BookMapper
    {
        public static BookDto ToBookDto(this Book book)
        {
            return new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                Description = book.Description,
                Rating = book.Rating,
                PublishedDate = book.PublishedDate,
                Language = book.Languages,
                AgeGroup = book.AgeGroup,
                Genres = book.Genres.Select(g => g.Title).ToList(),
                Writers = book.Writers.Select(d => new WriterDto { Name = d.Name, ImagePath = d.ImagePath }).ToList(),
                PosterImageUrl = book.PosterImageUrl,
                StreamUrl = book.StreamUrl,

            };
        }

    }
}
