using EntertainmentApp.Domain.Entities.Publication;
using Microsoft.EntityFrameworkCore;

namespace EntertainmentApp.Applicatoin.Interfaces
{
    public interface IPublicationRepository
    {
        public Task<Genre> AddGenreAsync(Genre genre);

        public Task<Genre?> GetGenreAsync(string publicationGenre);
        public Task<List<Genre>> GetPublicationGenresAsync();

        public Task<Publisher?> GetPublisherAsync(string publisherName);
        public Task<List<Publisher>> GetAllPublishersAsync();
        public Task<Publisher> AddPublisherAsync(Publisher publisher);

        public Task<NewsPaper> AddNewsPaperAsync(NewsPaper paper);

        public Task DeleteNewsPaperAsync(NewsPaper newsPaper);
        public Task<List<NewsPaper>> GetNewsPapersByFilterAsync(string language, string genre);

        public Task<List<NewsPaper>> GetNewsPapersByGenre(string genre);

        public Task<NewsPaper?> GetNewsPaperByIdAsync(Guid id);

        public Task<List<NewsPaper>> GetNewsPapersAsync();

        public Task<List<NewsPaper>> GetNewsPapersByLanguage(string language);
        public Task<NewsPaper> UpdateNewsPaperAsync(NewsPaper newsPaper);



        public Task<Magazine> AddMagazineAsync(Magazine paper);

        public Task DeleteMagazineAsync(Magazine paper);

        public Task<List<Magazine>> GetMagazinesByFilterAsync(string language, string genre);

        public Task<List<Magazine>> GetMagazinesByGenre(string genre);

        public Task<Magazine?> GetMagazineByIdAsync(Guid id);
        public Task<List<Magazine>> GetMagazinesAsync();
        public Task<List<Magazine>> GetMagazinesByLanguage(string language);

        public Task<Magazine> UpdateMagazineAsync(Magazine paper);

    }
}
