using Entertainment.Server.Applicatoin.Interfaces;
using Entertainment.Server.Domain.Entities.Story;

namespace Entertainment.Server.Infrastructure.Repository
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
            return await _context.Genres.Where(g => g.Books.Any() ||
                g.AudioStories.Any()||
                g.PodCasts.Any() ||
                g.Categories.Any(x => x.ToLower() == "story")
            ).ToListAsync();
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

        public async Task DeleteBookAsync(Book book)
        {
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Book>> GetBooksByGenre(string genre)
        {
            return await _context.Books
                .Include(b => b.Genres)
                .Include(b => b.Writers)
                .Where(b => b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }
        public async Task<List<Book>> GetBooksByLanguage(string language)
        {
            if (language.ToLower() == "persian")
                return await _context.Books
                    .Include(b => b.Genres)
                    .Include(b => b.Writers)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian"))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();

            

            return await _context.Books
                .Include(b => b.Genres)
                .Include(b => b.Writers)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian"))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

        }

        public async Task<List<Book>> GetBookByFilterAsync(string language, string genre)
        {
            if (language.ToLower() == "persian")
            {
                return await _context.Books
                    .Include(b => b.Genres)
                    .Include(b => b.Writers)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian") &&
                                b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();
            }
            return await _context.Books
                .Include(b => b.Genres)
                .Include(b => b.Writers)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian") &&
                            b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }







        public async Task<Speaker> AddSpeakerAsync(Speaker speaker)
        {
            await _context.Speakers.AddAsync(speaker);
            await _context.SaveChangesAsync();
            return speaker;
        }

        public async Task<Speaker?> GetSpeakerAsync(string speakerName)
        {
            return await _context.Speakers.FirstOrDefaultAsync(s => s.Name.ToLower() == speakerName.ToLower());
        }


        public async Task<PodCast> AddPodCastAsync(PodCast podCast)
        {
            await _context.PodCasts.AddAsync(podCast);
            await _context.SaveChangesAsync();
            return podCast;
        }

        public async Task<List<PodCast>> GetPodCastsAsync()
        {
            return await _context.PodCasts
                .Include(p => p.Speakers)
                .Include(p => p.Genres)
                .Include(p => p.Episodes)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<PodCast?> GetPodCastByIdAsync(Guid id)
        {
            return await _context.PodCasts
                .Include(p => p.Speakers)
                .Include(p => p.Genres)
                .Include(p => p.Episodes)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<PodCast> UpdatePodCastAsync(PodCast podCast)
        {
            _context.PodCasts.Update(podCast);
            await _context.SaveChangesAsync();
            return podCast;
        }

        public async Task DeletePodCastAsync(PodCast podCast)
        {
            _context.PodCasts.Remove(podCast);
            await _context.SaveChangesAsync();
        }

        public async Task<List<PodCast>> GetPodCastByGenre(string genre)
        {
            return await _context.PodCasts
                .Include(p => p.Genres)
                .Include(p => p.Speakers)
                .Include(p => p.Episodes)
                .Where(p => p.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<PodCast>> GetPodCastByLanguage(string language)
        {
            if (language.ToLower() == "persian")
                return await _context.PodCasts
                    .Include(p => p.Genres)
                    .Include(p => p.Speakers)
                    .Include(p => p.Episodes)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian"))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();



            return await _context.PodCasts
                .Include(p => p.Genres)
                .Include(p => p.Speakers)
                .Include(p => p.Episodes)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian"))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<PodCast>> GetPodCastByFilterAsync(string language, string genre)
        {
            if (language.ToLower() == "persian")
            {
                return await _context.PodCasts
                    .Include(b => b.Genres)
                    .Include(p => p.Speakers)
                    .Include(p => p.Episodes)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian") &&
                                b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();
            }
            return await _context.PodCasts
                .Include(b => b.Genres)
                .Include(p => p.Speakers)
                .Include(p => p.Episodes)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian") &&
                            b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }



        public async Task<PodCastEpisode> AddPodCastEpisodeAsync(PodCastEpisode podCastEpisode)
        {
            await _context.PodCastEpisodes.AddAsync(podCastEpisode);
            await _context.SaveChangesAsync();
            return podCastEpisode;
        }

        public async Task<PodCastEpisode?> GetPodCastEpisodeByIdAsync(Guid id)
        {
            return await _context.PodCastEpisodes.FindAsync(id);
        }

        public async Task DeletePodCastEpisodeAsync(PodCastEpisode episode)
        {
            _context.PodCastEpisodes.Remove(episode);
            await _context.SaveChangesAsync();
        }






        public async Task<AudioStory> AddAudioStoryAsync(AudioStory audioStory)
        {
            await _context.AudioStories.AddAsync(audioStory);
            await _context.SaveChangesAsync();
            return audioStory;
        }

        public async Task<List<AudioStory>> GetAudioStoryAsync()
        {
            return await _context.AudioStories
                .Include(p => p.Speakers)
                .Include(p => p.Genres)
                .Include(p => p.Episodes)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<AudioStory?> GetAudioStoryByIdAsync(Guid id)
        {
            return await _context.AudioStories
                .Include(p => p.Speakers)
                .Include(p => p.Genres)
                .Include(p => p.Episodes)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<AudioStory>> GetAudioStoryByGenre(string genre)
        {
            return await _context.AudioStories
                .Include(p => p.Genres)
                .Include(p => p.Speakers)
                .Include(p => p.Episodes)
                .Where(p => p.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<AudioStory>> GetAudioStoryByLanguage(string language)
        {
            if (language.ToLower() == "persian")
                return await _context.AudioStories
                    .Include(p => p.Genres)
                    .Include(p => p.Speakers)
                    .Include(p => p.Episodes)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian"))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();



            return await _context.AudioStories
                .Include(p => p.Genres)
                .Include(p => p.Speakers)
                .Include(p => p.Episodes)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian"))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<AudioStory>> GetAudioStoryByFilterAsync(string language, string genre)
        {
            if (language.ToLower() == "persian")
            {
                return await _context.AudioStories
                    .Include(b => b.Genres)
                    .Include(p => p.Speakers)
                    .Include(p => p.Episodes)
                    .Where(b => b.Languages.Any(l => l.ToLower() == "persian") &&
                                b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();
            }
            return await _context.AudioStories
                .Include(b => b.Genres)
                .Include(p => p.Speakers)
                .Include(p => p.Episodes)
                .Where(b => b.Languages.Any(l => l.ToLower() != "persian") &&
                            b.Genres.Any(g => g.Title.ToLower() == genre.ToLower()))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<AudioStory> UpdateAudioStoryAsync(AudioStory audioStory)
        {
            _context.AudioStories.Update(audioStory);
            await _context.SaveChangesAsync();
            return audioStory;
        }

        public async Task DeleteAudioStoryAsync(AudioStory audioStory)
        {
            _context.AudioStories.Remove(audioStory);
            await _context.SaveChangesAsync();
        }





        public async Task<AudioStoryEpisode> AddAudioStoryEpisodeAsync(AudioStoryEpisode podCastEpisode)
        {
            await _context.AudioStoryEpisodes.AddAsync(podCastEpisode);
            await _context.SaveChangesAsync();
            return podCastEpisode;
        }

        public async Task<AudioStoryEpisode?> GetAudioStoryEpisodeByIdAsync(Guid id)
        {
            return await _context.AudioStoryEpisodes.FindAsync(id);
        }

        public async Task DeleteAudioStoryEpisodeAsync(AudioStoryEpisode episode)
        {
            _context.AudioStoryEpisodes.Remove(episode);
            await _context.SaveChangesAsync();
        }
    }
}
