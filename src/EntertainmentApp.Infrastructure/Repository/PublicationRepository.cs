using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Music;
using EntertainmentApp.Domain.Entities.Publication;

namespace EntertainmentApp.Infrastructure.Repository
{
    public class PublicationRepository : IPublicationRepository
    {
        private readonly ApplicationDBContext _context;
        public PublicationRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Genre> AddGenreAsync(Genre genre)
        {
            await _context.Genres.AddAsync(genre);
            await _context.SaveChangesAsync();
            return genre;
        }

        public async Task<Genre?> GetGenreAsync(string publicationGenre)
        {
            return await _context.Genres.FirstOrDefaultAsync(g => g.Title.ToLower() == publicationGenre.ToLower());
        }
        public async Task<List<Genre>> GetPublicationGenresAsync()
        {
            return await _context.Genres.Where(g => g.NewsPapers.Any() ||
                g.Magazines.Any()
            ).ToListAsync();
        }

        public async Task<Publisher?> GetPublisherAsync(string publisherName)
        {
            return await _context.Publishers.FirstOrDefaultAsync(s => s.Name.ToLower() == publisherName.ToLower());
        }
        public async Task<List<Publisher>> GetAllPublishersAsync()
        {
            return await _context.Publishers.ToListAsync();
        }
        public async Task<Publisher> AddPublisherAsync(Publisher publisher)
        {
            await _context.Publishers.AddAsync(publisher);
            await _context.SaveChangesAsync();
            return publisher;
        }


        public async Task<NewsPaper> AddNewsPaperAsync(NewsPaper paper)
        {
            await _context.NewsPapers.AddAsync(paper);
            await _context.SaveChangesAsync();
            return paper;
        }

        public async Task DeleteNewsPaperAsync(NewsPaper newsPaper)
        {
            _context.NewsPapers.Remove(newsPaper);
            await _context.SaveChangesAsync();

        }

        public async Task<List<NewsPaper>> GetNewsPapersByFilterAsync(string language, string genre)
        {
            if (language.ToLower() == "persian")
            {
                return await _context.NewsPapers
                    .Include(b => b.Genres)
                    .Include(b => b.Publisher)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian") &&
                                b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();
            }
            return await _context.NewsPapers
                .Include(b => b.Genres)
                .Include(b => b.Publisher)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian") &&
                            b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<NewsPaper>> GetNewsPapersByGenre(string genre)
        {

            return await _context.NewsPapers
                .Include(b => b.Genres)
                .Include(b => b.Publisher)
                .Where(b => b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<NewsPaper?> GetNewsPaperByIdAsync(Guid id)
        {

            return await _context.NewsPapers
                .Include(m => m.Genres)
                .Include(b => b.Publisher)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<List<NewsPaper>> GetNewsPapersAsync()
        {
            return await _context.NewsPapers
                .Include(m => m.Genres)
                .Include(b => b.Publisher)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<NewsPaper>> GetNewsPapersByLanguage(string language)
        {
            if (language.ToLower() == "persian")
                return await _context.NewsPapers
                    .Include(b => b.Genres)
                    .Include(b => b.Publisher)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian"))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();



            return await _context.NewsPapers
                .Include(b => b.Genres)
                .Include(b => b.Publisher)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian"))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<NewsPaper> UpdateNewsPaperAsync(NewsPaper newsPaper)
        {
            _context.Update(newsPaper);
            await _context.SaveChangesAsync();
            return newsPaper;
        }






















        public async Task<Magazine> AddMagazineAsync(Magazine paper)
        {
            await _context.Magazines.AddAsync(paper);
            await _context.SaveChangesAsync();
            return paper;
        }

        public async Task DeleteMagazineAsync(Magazine paper)
        {
            _context.Magazines.Remove(paper);
            await _context.SaveChangesAsync();

        }

        public async Task<List<Magazine>> GetMagazinesByFilterAsync(string language, string genre)
        {
            if (language.ToLower() == "persian")
            {
                return await _context.Magazines
                    .Include(b => b.Genres)
                    .Include(b => b.Publisher)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian") &&
                                b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();
            }
            return await _context.Magazines
                .Include(b => b.Genres)
                .Include(b => b.Publisher)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian") &&
                            b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Magazine>> GetMagazinesByGenre(string genre)
        {

            return await _context.Magazines
                .Include(b => b.Genres)
                .Include(b => b.Publisher)
                .Where(b => b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<Magazine?> GetMagazineByIdAsync(Guid id)
        {

            return await _context.Magazines
                .Include(m => m.Genres)
                .Include(b => b.Publisher)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<List<Magazine>> GetMagazinesAsync()
        {
            return await _context.Magazines
                .Include(m => m.Genres)
                .Include(b => b.Publisher)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Magazine>> GetMagazinesByLanguage(string language)
        {
            if (language.ToLower() == "persian")
                return await _context.Magazines
                    .Include(b => b.Genres)
                    .Include(b => b.Publisher)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian"))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();



            return await _context.Magazines
                .Include(b => b.Genres)
                .Include(b => b.Publisher)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian"))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<Magazine> UpdateMagazineAsync(Magazine paper)
        {
            _context.Update(paper);
            await _context.SaveChangesAsync();
            return paper;
        }




    }
}
