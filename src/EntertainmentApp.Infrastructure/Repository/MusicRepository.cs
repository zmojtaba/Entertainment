using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Music;
using EntertainmentApp.Domain.Entities.Story;

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
                g.Albums.Any() ||
                g.Categories.Any(x => x.ToLower() == "music")
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
                    .Include(b => b.Singer)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian") &&
                                b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();
            }
            return await _context.Tracks
                .Include(b => b.Genres)
                .Include(b => b.Singer)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian") &&
                            b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Track>> GetTrackByGenre(string genre)
        {
            
            return await _context.Tracks
                .Include(b => b.Genres)
                .Include(b => b.Singer)
                .Where(b => b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<Track?> GetTrackByIdAsync(Guid id)
        {
            
            return await _context.Tracks
                .Include(m => m.Genres)
                .Include(b => b.Singer)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<List<Track>> GetTracksAsync()
        {
            return await _context.Tracks
                .Include(m => m.Genres)
                .Include(b => b.Singer)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Track>> GetTracksByLanguage(string language)
        {
            if (language.ToLower() == "persian")
                return await _context.Tracks
                    .Include(b => b.Genres)
                    .Include(b => b.Singer)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian"))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();



            return await _context.Tracks
                .Include(b => b.Genres)
                .Include(b => b.Singer)
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





        public async Task<Album> AddAlbumAsync(Album album)
        {
            await _context.Albums.AddAsync(album);
            await _context.SaveChangesAsync();
            return album;
        }

        public async Task<List<Album>> GetAlbumsAsync()
        {
            return await _context.Albums
                .Include(p => p.Singer)
                .Include(p => p.Genres)
                .Include(p => p.Episodes)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Album?> GetAlbumByIdAsync(Guid id)
        {
            return await _context.Albums
                .Include(p => p.Singer)
                .Include(p => p.Genres)
                .Include(p => p.Episodes)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Album> UpdateAlbumAsync(Album album)
        {
            _context.Albums.Update(album);
            await _context.SaveChangesAsync();
            return album;
        }

        public async Task DeleteAlbumAsync(Album album)
        {
            _context.Albums.Remove(album);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Album>> GetAlbumByGenre(string genre)
        {
            return await _context.Albums
                .Include(p => p.Genres)
                .Include(p => p.Singer)
                .Include(p => p.Episodes)
                .Where(p => p.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Album>> GetAlbumByLanguage(string language)
        {
            if (language.ToLower() == "persian")
                return await _context.Albums
                    .Include(p => p.Genres)
                    .Include(p => p.Singer)
                    .Include(p => p.Episodes)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian"))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();



            return await _context.Albums
                .Include(p => p.Genres)
                .Include(p => p.Singer)
                .Include(p => p.Episodes)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian"))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Album>> GetAlbumByFilterAsync(string language, string genre)
        {
            if (language.ToLower() == "persian")
            {
                return await _context.Albums
                    .Include(b => b.Genres)
                    .Include(p => p.Singer)
                    .Include(p => p.Episodes)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian") &&
                                b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();
            }
            return await _context.Albums
                .Include(b => b.Genres)
                .Include(p => p.Singer)
                .Include(p => p.Episodes)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian") &&
                            b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Album>> GetAlbumsBySingerName(string singer)
        {
            return await _context.Albums.Include(x => x.Singer).Where(x => x.Singer.Name.ToLower() == singer.ToLower()).ToListAsync();
        }



        public async Task<AlbumEpisode> AddAlbumEpisodeAsync(AlbumEpisode albumEpisode)
        {
            await _context.AlbumEpisodes.AddAsync(albumEpisode);
            await _context.SaveChangesAsync();
            return albumEpisode;
        }

        public async Task<AlbumEpisode?> GetAlbumEpisodeByIdAsync(Guid id)
        {
            return await _context.AlbumEpisodes.FindAsync(id);
        }
        public async Task<AlbumEpisode> UpdateAlbumEpisodeAsync(AlbumEpisode episode)
        {
            _context.AlbumEpisodes.Update(episode);
            await _context.SaveChangesAsync();
            return episode;
        }

        public async Task DeleteAlbumEpisodeAsync(AlbumEpisode episode)
        {
            _context.AlbumEpisodes.Remove(episode);
            await _context.SaveChangesAsync();
        }















    }
}
