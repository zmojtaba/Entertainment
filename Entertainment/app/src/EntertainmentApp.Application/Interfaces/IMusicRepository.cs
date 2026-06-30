using EntertainmentApp.Domain.Entities.Music;
using EntertainmentApp.Domain.Entities.Story;
using Microsoft.EntityFrameworkCore;

namespace EntertainmentApp.Application.Interfaces
{
    public interface IMusicRepository
    {
        public Task<Genre?> GetGenreAsync(string movieGenre);
        public Task<Genre> AddGenreAsync(Genre genre);
        public Task<List<Genre>> GetMusicGenresAsync();



        public Task<Singer?> GetSingerAsync(string singerName);
        public Task<Singer> AddSingerAsync(Singer singer);
        public Task<List<Singer>> GetAllSingersAsync();


        public Task<Track> AddTrackAsync(Track track);
        public Task<List<Track>> GetTracksAsync();
        public Task<Track?> GetTrackByIdAsync(Guid id);
        public Task<Track> UpdateTrackAsync(Track track);
        public Task DeleteTrackAsync(Track book);
        public Task<List<Track>> GetTrackByGenre(string genre);
        public Task<List<Track>> GetTracksByLanguage(string language);
        public Task<List<Track>> GetTrackByFilterAsync(string language, string genre);








        public Task<Album> AddAlbumAsync(Album album);
        public Task<List<Album>> GetAlbumsAsync();
        public Task<Album?> GetAlbumByIdAsync(Guid id);
        public Task<Album> UpdateAlbumAsync(Album album);
        public Task DeleteAlbumAsync(Album album);
        public Task<List<Album>> GetAlbumByGenre(string genre);
        public Task<List<Album>> GetAlbumByLanguage(string language);
        public Task<List<Album>> GetAlbumByFilterAsync(string language, string genre);
        public Task<List<Album>> GetAlbumsBySingerName(string singer);
        public Task<AlbumEpisode> AddAlbumEpisodeAsync(AlbumEpisode albumEpisode);
        public Task<AlbumEpisode?> GetAlbumEpisodeByIdAsync(Guid id);
        public Task DeleteAlbumEpisodeAsync(AlbumEpisode episode);
        public Task<AlbumEpisode> UpdateAlbumEpisodeAsync(AlbumEpisode episode);








        public Task<List<Guid>> GetNotExistTracksId(List<Guid> ids);
        public Task<List<Guid>> GetNotExistOnSeverTracksId(List<Guid> ids);

        public Task<List<Track>> GetTracksNeedToDownloadAsync();
        public Task<List<Guid>> GetNotExistAlbumsId(List<Guid> ids);
        public Task<List<Guid>> GetNotExistOnSeverAlbumsId(List<Guid> ids);
        public Task<List<AlbumEpisode>> GetEpisodesNeedToDownloadAsync();
        public Task<Album?> GetAlbumByEpisodeIdAsync(Guid episodeId);
        public Task UpdateEpisodeAsync(AlbumEpisode episode);
        public Task<List<Album>> GetAlbumsNeedToDownloadAsync();


    }
}
