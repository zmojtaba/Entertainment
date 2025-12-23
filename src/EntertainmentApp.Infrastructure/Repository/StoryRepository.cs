using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Story;
using Microsoft.EntityFrameworkCore;

namespace EntertainmentApp.Infrastructure.Repository
{
    public class StoryRepository : IStoryRepository
    {
        private readonly ApplicationDBContext _context;
        public StoryRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<Genre?> GetGenreAsync(string bookGenre)
        {
            return await _context.Genres.FirstOrDefaultAsync(g => g.Title.ToLower() == bookGenre.ToLower());
        }

        public async Task<Genre> AddGenreAsync(Genre genre)
        {
            await _context.Genres.AddAsync(genre);
            await _context.SaveChangesAsync();
            return genre;
        }


        public async Task<Writer?> GetWriterAsync(string writerName)
        {
            return await _context.Writers.FirstOrDefaultAsync(a => a.Name.ToLower() == writerName.ToLower());
        }

        public async Task<List<Writer>> GetAllWritersAsync()
        {
            return await _context.Writers.ToListAsync();
        }

        public async Task<Writer> AddWriterAsync(Writer writer)
        {
            await _context.Writers.AddAsync(writer);
            await _context.SaveChangesAsync();
            return writer;
        }


        public async Task<List<Genre>> GetStoryGenresAsync()
        {
            return await _context.Genres.Where(g => g.Books.Any() ).ToListAsync();
        }


        public async Task<Book> AddMovieAsync(Book book)
        {
            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();
            return book;
        }

        public async Task<Book> AddBookAsync(Book book)
        {
            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();
            return book;

        }

        public async Task<List<Book>?> GetBooksAsync()
        {
            return await _context.Books
                .Include(b => b.Writers)
                .Include(m => m.Genres)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<Book?> GetBookByIdAsync(Guid id)
        {
            return await _context.Books
                .Include(b => b.Writers)
                .Include(m => m.Genres)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<Book> UpdateBookAsync(Book book)
        {
            _context.Books.Update(book);
            await _context.SaveChangesAsync();
            return book;
        }
    }
}
