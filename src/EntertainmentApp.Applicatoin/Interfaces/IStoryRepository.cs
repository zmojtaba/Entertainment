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
        public Task DeleteBookAsync(Book book);
        public Task<List<Book>> GetBooksByGenre(string genre);
        public Task<List<Book>> GetBooksByLanguage(string language);
        public Task<List<Book>> GetBookByFilterAsync(string language, string genre);





        public  Task<Speaker> AddSpeakerAsync(Speaker speaker);

        public Task<Speaker?> GetSpeakerAsync(string speakerName);


        public Task<PodCast> AddPodCastAsync(PodCast podCast);
        public Task<List<PodCast>> GetPodCastsAsync();
        public Task<PodCast?> GetPodCastByIdAsync(Guid id);
        public Task<List<PodCast>> GetPodCastByGenre(string genre);
        public Task<List<PodCast>> GetPodCastByLanguage(string language);
        public Task<List<PodCast>> GetPodCastByFilterAsync(string language, string genre);
        public Task<PodCast> UpdatePodCastAsync(PodCast podCast);
        public Task DeletePodCastAsync(PodCast podCast);


        public Task<PodCastEpisode> AddPodCastEpisodeAsync(PodCastEpisode podCastEpisode);
        public Task<PodCastEpisode?> GetPodCastEpisodeByIdAsync(Guid id);
        public Task DeletePodCastEpisodeAsync(PodCastEpisode episode);





    }
}
