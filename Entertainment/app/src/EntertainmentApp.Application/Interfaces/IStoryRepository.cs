using EntertainmentApp.Domain.Entities.Story;
using Microsoft.EntityFrameworkCore;

namespace EntertainmentApp.Application.Interfaces
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




        public Task<AudioStory> AddAudioStoryAsync(AudioStory audioStory);
        public Task<List<AudioStory>> GetAudioStoryAsync();
        public Task<AudioStory?> GetAudioStoryByIdAsync(Guid id);
        public Task<List<AudioStory>> GetAudioStoryByGenre(string genre);
        public Task<List<AudioStory>> GetAudioStoryByLanguage(string language);
        public Task<List<AudioStory>> GetAudioStoryByFilterAsync(string language, string genre);
        public Task<AudioStory> UpdateAudioStoryAsync(AudioStory podCast);
        public Task DeleteAudioStoryAsync(AudioStory podCast);


        public Task<AudioStoryEpisode> AddAudioStoryEpisodeAsync(AudioStoryEpisode podCastEpisode);
        public Task<AudioStoryEpisode?> GetAudioStoryEpisodeByIdAsync(Guid id);
        public Task DeleteAudioStoryEpisodeAsync(AudioStoryEpisode episode);




        public Task<List<Guid>> GetNotExistAudioStoriesId(List<Guid> ids);
        public Task<List<Guid>> GetNotExistOnSeverAudioStoriesId(List<Guid> ids);
        public Task<List<AudioStoryEpisode>> GetAudioEpisodesNeedToDownloadAsync();
        public Task<AudioStory?> GetAudioStoryByEpisodeIdAsync(Guid episodeId);
        public Task UpdateEpisodeAsync(AudioStoryEpisode episode);
        public Task<List<Guid>> GetNotExistBooksId(List<Guid> ids);
        public Task<List<Guid>> GetNotExistOnSeverBooksId(List<Guid> ids);
        public Task<List<Book>> GetBooksNeedToDownloadAsync();


        public Task<List<PodCast>> GetPodCastsNeedToDownloadAsync();
        public Task<List<AudioStory>> GetAudioStoriesNeedToDownloadAsync();


        public Task<List<Guid>> GetNotExistPodCastsId(List<Guid> ids);
        public Task<List<Guid>> GetNotExistOnSeverPodCastsId(List<Guid> ids);
        public Task<List<PodCastEpisode>> GetPodCastEpisodesNeedToDownloadAsync();
        public Task<PodCast?> GetPodCastByEpisodeIdAsync(Guid episodeId);



    }
}
