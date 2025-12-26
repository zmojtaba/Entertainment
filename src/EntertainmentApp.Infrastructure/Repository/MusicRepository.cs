using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Music;

namespace EntertainmentApp.Infrastructure.Repository
{
    public class MusicRepository : IMusicRepository
    {
        private readonly ApplicationDBContext _context;
        public MusicRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<Genre> AddGenreAsync(Genre genre)
        {
            await _context.Genres.AddAsync(genre);
            await  _context.SaveChangesAsync();
            return genre;
        }

        public async Task<Genre?> GetGenreAsync(string movieGenre)
        {
            return await _context.Genres.FirstOrDefaultAsync(g => g.Title.ToLower() == movieGenre.ToLower());
        }
        public async Task<List<Genre>> GetMusicGenresAsync()
        {
            return await _context.Genres.Where(g => g.Tracks.Any() ||
                g.Albums.Any()
            ).ToListAsync();
        }



        public async Task<Singer?> GetSingerAsync(string singerName)
        {
            return await _context.Singers.FirstOrDefaultAsync(s => s.Name.ToLower() == singerName.ToLower());
        }
        public async Task<List<Singer>> GetAllSingersAsync()
        {
            return await _context.Singers.ToListAsync();
        }
        public async Task<Singer> AddSingerAsync(Singer singer)
        {
            await _context.Singers.AddAsync(singer);
            await _context.SaveChangesAsync();
            return singer;
        }


        public async Task<Track> AddTrackAsync(Track track)
        {
            await _context.Tracks.AddAsync(track);
            await _context.SaveChangesAsync();
            return track;
        }

        public async Task DeleteTrackAsync(Track track)
        {
            _context.Tracks.Remove(track);
            await _context.SaveChangesAsync();

        }

        public async Task<List<Track>> GetTrackByFilterAsync(string language, string genre)
        {
            if (language.ToLower() == "persian")
            {
                return await _context.Tracks
                    .Include(b => b.Genres)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian") &&
                                b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();
            }
            return await _context.Tracks
                .Include(b => b.Genres)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian") &&
                            b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Track>> GetTrackByGenre(string genre)
        {
            
            return await _context.Tracks
                .Include(b => b.Genres)
                .Where(b => b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<Track?> GetTrackByIdAsync(Guid id)
        {
            
            return await _context.Tracks
                .Include(m => m.Genres)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<List<Track>> GetTracksAsync()
        {
            return await _context.Tracks
                .Include(m => m.Genres)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Track>> GetTracksByLanguage(string language)
        {
            if (language.ToLower() == "persian")
                return await _context.Tracks
                    .Include(b => b.Genres)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian"))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();



            return await _context.Tracks
                .Include(b => b.Genres)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian"))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<Track> UpdateTrackAsync(Track track)
        {
            _context.Update(track);
            await _context.SaveChangesAsync();
            return track;
        }
    }
}
