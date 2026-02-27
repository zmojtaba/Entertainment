using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Exceptions;
using EntertainmentApp.Domain.Entities.Music;
using EntertainmentApp.Domain.Entities.Publication;
using EntertainmentApp.Domain.Entities.Story;

namespace EntertainmentApp.Applicatoin.Features.Video
{
    public record DeleteGenreCommand(string Genre, string Category) : ICommand;

    public class DeleteGenreHandler : ICommandHandler<DeleteGenreCommand>
    {
        private readonly IHomeRepository _homeRepository;
        private readonly IMovieRepository _movieRepository;
        private readonly ISeriesRepository _seriesRepository;
        private readonly IMusicRepository _musicRepo;
        private readonly IStoryRepository _storyRepo;
        private readonly IPublicationRepository _pubRepo;
        private readonly IMediaService _mediaService;
        public DeleteGenreHandler(IHomeRepository homeRepository,
            IMediaService mediaService, 
            ISeriesRepository seriesRepository, 
            IMovieRepository movieRepository, 
            IMusicRepository musicRepo, 
            IStoryRepository storyRepo, 
            IPublicationRepository pubRepo)
        {
            _homeRepository = homeRepository;
            _mediaService = mediaService;
            _seriesRepository = seriesRepository;
            _movieRepository = movieRepository;
            _musicRepo = musicRepo;
            _storyRepo = storyRepo;
            _pubRepo = pubRepo;
        }
        public async Task<Unit> Handle(DeleteGenreCommand command, CancellationToken cancellationToken)
        {
            Genre? genre = await _homeRepository.GetGenreAsync(command.Genre);
            if (genre == null) throw new NotFoundException($"Genre '{command.Genre}' not found");

            var category = command.Category.ToLower().Trim();


            switch (category)
            {
                case "video":
                    await DeleteVideoGenre(genre);
                    genre.Categories.Remove("Video");
                    break;

                case "music":
                    await DeleteMusicGenre(genre);
                    genre.Categories.Remove("Music");
                    break;

                case "story":
                    await DeleteStoryGenre(genre);
                    genre.Categories.Remove("Story");
                    break;

                case "publication":
                    await DeletePublicationGenre(genre);
                    genre.Categories.Remove("Publication");
                    break;

                default:
                    throw new DomainException($"Invalid category '{category}'");
            }
            if ( !genre.Categories.Any() ) await _homeRepository.DeleteGenreAsync(genre);



            await _homeRepository.SaveChangesAsync();










            //List<Movie> movies = await _movieRepository.GetMoviesByGenre(command.Genre);
            ///// movie part
            //List<Movie> moviesToDelete = new List<Movie>();
            //foreach (Movie movie in movies)
            //{
            //    if (movie.RemoveGenre(genre))  moviesToDelete.Add(movie);
            //}

            //foreach (Movie movie in moviesToDelete)
            //{
            //    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(movie.StreamUrl), true);
            //    await _movieRepository.DeleteMovieAsync(movie);
            //}

            ////// series part should be implemented in the future when series feature is implemented
            /////
            //List<Series> series = await _seriesRepository.GetSeriesByGenreAsync(command.Genre);
            //List<Series> seriesToDelete = new List<Series>();
            //foreach (Series s in series)
            //{
            //    if (s.RemoveGenre(genre)) seriesToDelete.Add(s);
            //}

            //foreach (Series s in seriesToDelete)
            //{
            //    await _mediaService.DeleteMediaDirecoryAsync(
            //        Path.GetDirectoryName(s.PosterImageUrl), true
            //        );
            //    await _seriesRepository.DeleteSeriesAsync(s);
            //}

            //await _movieRepository.DeleteGenreAsync(genre);


            return Unit.Value;
        }

        private async Task DeleteVideoGenre(Genre genre)
        {
            List<Movie> movies = await _movieRepository.GetMoviesByGenre(genre.Title);

            foreach (Movie movie in movies)
            {
                if (movie.RemoveGenre(genre))
                {
                    await _mediaService.DeleteMediaDirecoryAsync(
                        Path.GetDirectoryName(movie.StreamUrl), true);

                    await _movieRepository.DeleteMovieAsync(movie);
                }
            }

            List<Series> series = await _seriesRepository.GetSeriesByGenreAsync(genre.Title);

            foreach (Series s in series)
            {
                if (s.RemoveGenre(genre))
                {
                    await _mediaService.DeleteMediaDirecoryAsync(
                        Path.GetDirectoryName(s.PosterImageUrl), true);

                    await _seriesRepository.DeleteSeriesAsync(s);
                }
            }
        }
        private async Task DeleteMusicGenre(Genre genre)
        {
            List<Track> trackes = await _musicRepo.GetTrackByGenre(genre.Title);

            foreach (Track t in trackes)
            {
                if (t.RemoveGenre(genre))
                {
                    await _mediaService.DeleteMediaDirecoryAsync(
                        Path.GetDirectoryName(t.StreamUrl), true);

                    await _musicRepo.DeleteTrackAsync(t);
                }
            }

            List<Album> albums = await _musicRepo.GetAlbumByGenre(genre.Title);

            foreach (Album a in albums)
            {
                if (a.RemoveGenre(genre))
                {
                    await _mediaService.DeleteMediaDirecoryAsync(
                        Path.GetDirectoryName(a.PosterImageUrl), true);

                    await _musicRepo.DeleteAlbumAsync(a);
                }
            }
        }

        private async Task DeleteStoryGenre(Genre genre)
        {
            List<Book> books = await _storyRepo.GetBooksByGenre(genre.Title);

            foreach (Book b in books)
            {
                if (b.RemoveGenre(genre))
                {
                    await _mediaService.DeleteMediaDirecoryAsync(
                        Path.GetDirectoryName(b.StreamUrl), true);

                    await _storyRepo.DeleteBookAsync(b);
                }
            }

            List<AudioStory> audioStories = await _storyRepo.GetAudioStoryByGenre(genre.Title);

            foreach (AudioStory a in audioStories)
            {
                if (a.RemoveGenre(genre))
                {
                    await _mediaService.DeleteMediaDirecoryAsync(
                        Path.GetDirectoryName(a.PosterImageUrl), true);

                    await _storyRepo.DeleteAudioStoryAsync(a);
                }
            }

            List<PodCast> podCasts = await _storyRepo.GetPodCastByGenre(genre.Title);

            foreach (PodCast p in podCasts)
            {
                if (p.RemoveGenre(genre))
                {
                    await _mediaService.DeleteMediaDirecoryAsync(
                        Path.GetDirectoryName(p.PosterImageUrl), true);

                    await _storyRepo.DeletePodCastAsync(p);
                }
            }
        }

        private async Task DeletePublicationGenre(Genre genre)
        {
            List<NewsPaper> newspapers = await _pubRepo.GetNewsPapersByGenre(genre.Title);

            foreach (NewsPaper n in newspapers)
            {
                if (n.RemoveGenre(genre))
                {
                    await _mediaService.DeleteMediaDirecoryAsync(
                        Path.GetDirectoryName(n.StreamUrl), true);

                    await _pubRepo.DeleteNewsPaperAsync(n);
                }
            }
            List<Magazine> magazines = await _pubRepo.GetMagazinesByGenre(genre.Title);

            foreach (Magazine m in magazines)
            {
                if (m.RemoveGenre(genre))
                {
                    await _mediaService.DeleteMediaDirecoryAsync(
                        Path.GetDirectoryName(m.StreamUrl), true);

                    await _pubRepo.DeleteMagazineAsync(m);
                }
            }
        }
    }
}
