using EntertainmentApp.Application.Interfaces;

namespace EntertainmentApp.Infrastructure.Repository
{
    public class HomeRepository : IHomeRepository
    {
        private readonly ApplicationDBContext _context;
        public HomeRepository(ApplicationDBContext dbContext)
        {
            _context = dbContext;
        }

        public async Task<List<Genre>?> GetGenresAsync()
        {
            return await _context.Genres
                .Include(x => x.Movies)
                .Include(x => x.Series)
                .Include(x => x.Tracks)
                .Include(x => x.Albums)
                .Include(x => x.Books)
                .Include(x => x.PodCasts)
                .Include(x => x.AudioStories)
                .Include(x => x.NewsPapers)
                .Include(x => x.Magazines)
                .ToListAsync();
        }

        public async Task<Genre?> GetGenreAsync(string title)
        {
            return await _context.Genres
                .Include(x => x.Movies)
                .Include(x => x.Series)
                .Include(x => x.Tracks)
                .Include(x => x.Albums)
                .Include(x => x.Books)
                .Include(x => x.PodCasts)
                .Include(x => x.AudioStories)
                .Include(x => x.NewsPapers)
                .Include(x => x.Magazines)
                .FirstOrDefaultAsync(x => x.Title.ToLower() == title.ToLower());
        }

        public async Task<Genre> AddGenreAsync(Genre genre)
        {
            await _context.Genres.AddAsync(genre);
            await _context.SaveChangesAsync();
            return genre;
        }

        public async Task DeleteGenreAsync(Genre genre)
        {
            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }


    }
}
