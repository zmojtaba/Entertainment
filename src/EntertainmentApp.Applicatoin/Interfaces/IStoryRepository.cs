using EntertainmentApp.Domain.Entities.Story;
using Microsoft.EntityFrameworkCore;

namespace EntertainmentApp.Applicatoin.Interfaces
{
    public interface IStoryRepository
    {
        public Task<Genre?> GetGenreAsync(string movieGenre);
        public Task<Genre> AddGenreAsync(Genre genre);
        public Task<List<Genre>> GetStoryGenresAsync();



        public  Task<Writer?> GetWriterAsync(string writerName);

        public  Task<List<Writer>> GetAllWritersAsync();

        public  Task<Writer> AddWriterAsync(Writer writer);

        
        
        
        public Task<Book> AddBookAsync(Book book);
        public Task<List<Book>> GetBooksAsync();
        public Task<Book?> GetBookByIdAsync(Guid id);
        public Task<Book>  UpdateBookAsync(Book book);

    }
}
