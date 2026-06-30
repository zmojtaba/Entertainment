namespace EntertainmentApp.Application.Features.UpdateMedia
{
    public record GetMediaDownloadQueueQuery() : IQuery<GetMediaDownloadQueueResponse>;
    public record GetMediaDownloadQueueResponse(List<Movie>? Movie, List<Series>? Series,
        List<Coru>? Coru,
        List<Track>? Track, List<Album>? Album,
        List<Magazine>? Magazine, List<NewsPaper>? NewsPaper,
        List<AudioStory>? AudioStory, List<Book>? Book, List<PodCast>? PodCast, List<DownloadItemDto>? CurrentlyDownload
        );

    public class GetMediaDownloadQueueHandler(IMovieRepository movieRepo, ISeriesRepository seriesRepo,
        IStoryRepository storyRepo, 
        IMusicRepository musicRepository,
        IPublicationRepository publicationRepository,
        ICoruRepository coruRepo,
        IDownloadQueue queue
        ) : IQueryHandler<GetMediaDownloadQueueQuery, GetMediaDownloadQueueResponse>
    {
        public async Task<GetMediaDownloadQueueResponse> Handle(GetMediaDownloadQueueQuery request, CancellationToken cancellationToken)
        {
            List<Movie> movies = await movieRepo.GetMoviesNeedToDownloadAsync();
            List<Series> series = await seriesRepo.GetSeriesNeedToDownloadAsync();
            List<Coru> corus = await coruRepo.GetCorusNeedToDownloadAsync();
            List<Track> tracks = await musicRepository.GetTracksNeedToDownloadAsync();
            List<Album> albums = await musicRepository.GetAlbumsNeedToDownloadAsync();
            List<Magazine> magazines = await publicationRepository.GetMagazinesNeedToDownloadAsync();
            List<NewsPaper> newsPapers = await publicationRepository.GetNewsPapersNeedToDownloadAsync();
            List<AudioStory> audioStories = await storyRepo.GetAudioStoriesNeedToDownloadAsync();
            List<Book>? books = await storyRepo.GetBooksNeedToDownloadAsync();
            List<PodCast> podCasts = await storyRepo.GetPodCastsNeedToDownloadAsync();
            List<DownloadItemDto> downloadItems = new();

            foreach (Movie movie in movies)
            {
                if (movie.CurrentlyDownload == true)
                    downloadItems.Add(new DownloadItemDto
                    {
                        Id = movie.Id,
                        Type = MediaType.Movie.ToString(),
                        CurrentlyDownload = true
                    });
            }

            foreach (Series item in series)
            {
                if (item.CurrentlyDownload == true)
                    downloadItems.Add(new DownloadItemDto
                    {
                        Id = item.Seasons.SelectMany(s => s.Episodes).FirstOrDefault(ep => ep.CurrentlyDownload == true).Id,
                        Type = MediaType.Series.ToString(),
                        CurrentlyDownload = true
                    });
            }

            foreach (Track item in tracks)
            {
                if (item.CurrentlyDownload == true)
                    downloadItems.Add(new DownloadItemDto
                    {
                        Id = item.Id,
                        Type = MediaType.Track.ToString(),
                        CurrentlyDownload = true
                    });
            }

            foreach (Album item in albums)
            {
                if (item.CurrentlyDownload == true)
                    downloadItems.Add(new DownloadItemDto
                    {
                        Id = item.Episodes.FirstOrDefault(x => x.CurrentlyDownload == true).Id,
                        Type = MediaType.Album.ToString(),
                        CurrentlyDownload = true
                    });
            }

            foreach (Magazine item in magazines)
            {
                if (item.CurrentlyDownload == true)
                    downloadItems.Add(new DownloadItemDto
                    {
                        Id = item.Id,
                        Type = MediaType.Magazine.ToString(),
                        CurrentlyDownload = true
                    });
            }

            foreach (NewsPaper item in newsPapers)
            {
                if (item.CurrentlyDownload == true)
                    downloadItems.Add(new DownloadItemDto
                    {
                        Id = item.Id,
                        Type = MediaType.NewsPaper.ToString(),
                        CurrentlyDownload = true
                    });
            }

            foreach (AudioStory item in audioStories)
            {
                if (item.CurrentlyDownload == true)
                    downloadItems.Add(new DownloadItemDto
                    {
                        Id = item.Episodes.FirstOrDefault(x => x.CurrentlyDownload == true).Id,
                        Type = MediaType.AudioStory.ToString(),
                        CurrentlyDownload = true
                    });
            }

            if (books != null)
            {
                foreach (Book item in books)
                {
                    if (item.CurrentlyDownload == true)
                        downloadItems.Add(new DownloadItemDto
                        {
                            Id = item.Id,
                            Type = MediaType.Book.ToString(),
                            CurrentlyDownload = true
                        });
                }
            }

            foreach (PodCast item in podCasts)
            {
                if (item.CurrentlyDownload == true)
                    downloadItems.Add(new DownloadItemDto
                    {
                        Id = item.Episodes.FirstOrDefault(x => x.CurrentlyDownload == true).Id,
                        Type = MediaType.PodCast.ToString(),
                        CurrentlyDownload = true
                    });
            }

            // var currentlyDownload = queue.GetCurrentlyDownload();
            var currentlyDownload = new DownloadItem();
            var result = new GetMediaDownloadQueueResponse(
                movies,
                series,
                corus,
                tracks,
                albums,
                magazines,
                newsPapers,
                audioStories,
                books,
                podCasts,
                downloadItems
            );

            return result;
        }
    }
}
