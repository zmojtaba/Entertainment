using EntertainmentApp.Domain.Entities.Publication;
using System.Collections;

namespace EntertainmentApp.Application.Services
{
    public class DownloadQueuSyncService : IDownloadQueueSyncService
    {
        private readonly IMovieRepository _movieRepo;
        private readonly ISeriesRepository _seriesRepo;
        private readonly IMusicRepository _musicRepo;
        private readonly IStoryRepository _storyRepo;
        private readonly IPublicationRepository _pubRepo;
        private readonly ICoruRepository _coruRepo;
        private readonly IDownloadQueue _queue;

        public DownloadQueuSyncService(IMovieRepository movieRepo, IDownloadQueue queue, ISeriesRepository seriesRepo, IMusicRepository musicRepo, IStoryRepository storyRepo, IPublicationRepository pubRepo, ICoruRepository coruRepo)
        {
            _movieRepo = movieRepo;
            _queue = queue;
            _seriesRepo = seriesRepo;
            _musicRepo = musicRepo;
            _storyRepo = storyRepo;
            _pubRepo = pubRepo;
            _coruRepo = coruRepo;
        }

        public async Task SyncQueueAsync()
        {
            await SyncMovieAsync();
            await SyncSeriesAsync();
            await SyncTrackAsync();
            await SyncAlbumsAsync();
            await SyncBookAsync();
            await SyncAudioStoryAsync();
            await SyncPodCastAsync();
            await SyncNewsPaperAsync();
            await SyncMagazineAsync();
            await SyncCoruAsync();

        }
        private async Task SyncMovieAsync()
        {
            List<Movie> pendingMovies = await _movieRepo.GetMoviesNeedToDownloadAsync();

            foreach (var movie in pendingMovies)
            {
                _queue.Enqueue(new DownloadItem
                {
                    Id = movie.Id,
                    Type = MediaType.Movie,
                    CurrentlyDownload = movie.CurrentlyDownload ?? false

                });
            }
        }

        private async Task SyncSeriesAsync()
        {
            List<Episode> pendingEpisodes = await _seriesRepo.GetEpisodesNeedToDownloadAsync();

            foreach (var episode in pendingEpisodes)
            {
                _queue.Enqueue(new DownloadItem
                {
                    Id = episode.Id,
                    Type = MediaType.Series,
                    CurrentlyDownload = episode.CurrentlyDownload ?? false
                });
            }
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////  music    /////////////////////////////////////////////////////////
        private async Task SyncTrackAsync()
        {
            List<Track> pendingTracks = await _musicRepo.GetTracksNeedToDownloadAsync();

            foreach (var t in pendingTracks)
            {
                _queue.Enqueue(new DownloadItem
                {
                    Id = t.Id,
                    Type = MediaType.Track,
                    CurrentlyDownload = t.CurrentlyDownload ?? false

                });
            }
        }
        private async Task SyncAlbumsAsync()
        {
            List<AlbumEpisode> pendingEpisodes = await _musicRepo.GetEpisodesNeedToDownloadAsync();

            foreach (var e in pendingEpisodes)
            {
                _queue.Enqueue(new DownloadItem
                {
                    Id = e.Id,
                    Type = MediaType.Album,
                    CurrentlyDownload = e.CurrentlyDownload ?? false

                });
            }
        }



        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////  Story    /////////////////////////////////////////////////////////
        private async Task SyncBookAsync()
        {
            List<Book> pending = await _storyRepo.GetBooksNeedToDownloadAsync();

            foreach (var t in pending)
            {
                _queue.Enqueue(new DownloadItem
                {
                    Id = t.Id,
                    Type = MediaType.Book,
                    CurrentlyDownload = t.CurrentlyDownload ?? false

                });
            }
        }

        private async Task SyncAudioStoryAsync()
        {
            List<AudioStoryEpisode> pending = await _storyRepo.GetAudioEpisodesNeedToDownloadAsync();

            foreach (var t in pending)
            {
                _queue.Enqueue(new DownloadItem
                {
                    Id = t.Id,
                    Type = MediaType.AudioStory,
                    CurrentlyDownload = t.CurrentlyDownload ?? false

                });
            }
        }

        private async Task SyncPodCastAsync()
        {
            List<PodCastEpisode> pending = await _storyRepo.GetPodCastEpisodesNeedToDownloadAsync();

            foreach (var t in pending)
            {
                _queue.Enqueue(new DownloadItem
                {
                    Id = t.Id,
                    Type = MediaType.PodCast,
                    CurrentlyDownload = t.CurrentlyDownload ?? false

                });
            }
        }


        private async Task SyncNewsPaperAsync()
        {
            List<NewsPaper> pending = await _pubRepo.GetNewsPapersNeedToDownloadAsync();

            foreach (var t in pending)
            {
                _queue.Enqueue(new DownloadItem
                {
                    Id = t.Id,
                    Type = MediaType.NewsPaper,
                    CurrentlyDownload = t.CurrentlyDownload ?? false

                });
            }
        }

        private async Task SyncMagazineAsync() 
        {
            List<Magazine> pending = await _pubRepo.GetMagazinesNeedToDownloadAsync();

            foreach (var t in pending)
            {
                _queue.Enqueue(new DownloadItem
                {
                    Id = t.Id,
                    Type = MediaType.Magazine,
                    CurrentlyDownload = t.CurrentlyDownload ?? false

                });
            }
        }
        private async Task SyncCoruAsync()
        {
            List<Coru> pending = await _coruRepo.GetCorusNeedToDownloadAsync();

            foreach (var t in pending)
            {
                _queue.Enqueue(new DownloadItem
                {
                    Id = t.Id,
                    Type = MediaType.Coru,
                    CurrentlyDownload = t.CurrentlyDownload ?? false

                });
            }
        }



    }
}
