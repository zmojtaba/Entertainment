using EntertainmentApp.Domain.Entities.Publication;

namespace EntertainmentApp.Applicatoin.Common.Mappers
{
    public static class PublicationMapper
    {
        public static NewsPaperDto ToNewsPaperDto(this NewsPaper newsPaper)
        {
            return new NewsPaperDto
            {
                Id = newsPaper.Id,
                Title = newsPaper.Title,
                Languages = newsPaper.Languages,
                PublishedDate = newsPaper.PublishedDate,
                StreamUrl = newsPaper.StreamUrl,
                PosterImageUrl = newsPaper.PosterImageUrl,
                Genres = newsPaper.Genres.Select(g => g.ToGenreDto()).ToList(),
                Publisher = newsPaper.Publisher.ToPublisherDto()
            };

        }
        public static PublisherDto? ToPublisherDto(this Publisher? publisher)
        {
            if (publisher == null)
                return null;
            return new PublisherDto
            {
                Name = publisher.Name,
                ImagePath = publisher.ImagePath
            };
        }

        public static MagazineDto ToMagazineDto(this Magazine magazine)
        {
            return new MagazineDto
            {
                Id = magazine.Id,
                Title = magazine.Title,
                Languages = magazine.Languages,
                PublishedDate = magazine.PublishedDate,
                StreamUrl = magazine.StreamUrl,
                PosterImageUrl = magazine.PosterImageUrl,
                Genres = magazine.Genres.Select(g => g.ToGenreDto()).ToList(),
                Publisher = magazine.Publisher.ToPublisherDto()
            };
        }
    }
}
