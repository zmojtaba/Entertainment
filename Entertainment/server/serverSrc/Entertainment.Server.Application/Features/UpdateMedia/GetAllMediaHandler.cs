namespace Entertainment.Server.Application.Features.UpdateMedia
{
    public record GetAllMediaQuery() : IQuery<GetAllMediaResponse>;
    public record GetAllMediaResponse(List<MovieDto>? Movies, List<SeriesDto>? Series, 
        List<CoruDto>? Corus, 
        List<TrackDto>? Tracks,             List<AlbumDto>? Albums,
        List<MagazineDto>? Magazines,       List<NewsPaperDto>? NewsPapers,
        List<AudioStoryDto>? AudioStories,  List<BookDto>? Books, List<PodCastDto>? PodCasts
        );

    public class GetAllMediaHandler(IMediator mediator) : IQueryHandler<GetAllMediaQuery, GetAllMediaResponse>
    {
        public async Task<GetAllMediaResponse> Handle(GetAllMediaQuery request, CancellationToken cancellationToken)
        {
            List<MovieDto> movies;
            List<SeriesDto> series;
            List<CoruDto> corus;
            List<TrackDto> tracks;
            List<AlbumDto> albums;
            List<MagazineDto> magazines;
            List<NewsPaperDto> newsPapers;
            List<AudioStoryDto> audioStories;
            List<BookDto>? books;
            List<PodCastDto> podCasts;
            try
            {
                movies = await mediator.Send(new GetMoviesQuery(null, null));
            }
            catch
            {
                movies = [];
            }
            try
            {
                series = await mediator.Send(new GetSeriesQuery(null, null));
            }
            catch
            {
                series = [];
            }
            try
            {
                corus = await mediator.Send(new GetCorousQuery());
            }
            catch
            {
                corus = [];
            }
            try
            {
                tracks = await mediator.Send(new GetTracksQuery(null, null));
            }
            catch { tracks = []; }
            try
            {
                albums = await mediator.Send(new GetAlbumsQuery(null, null));
            }
            catch { albums = []; }

            try
            {
                magazines = await mediator.Send(new GetMagazinesQuery(null, null));
            }
            catch { magazines = []; }

            try
            {
                newsPapers = await mediator.Send(new GetNewsPapersQuery(null, null));
            }
            catch { newsPapers = []; }

            try
            {
                audioStories = await mediator.Send(new GetAudioStoriesQuery(null, null));
            }
            catch { audioStories = []; }

            try
            {
                books = await mediator.Send(new GetBooksQuery(null, null));
            }
            catch { books = []; }

            try
            {
                podCasts = await mediator.Send(new GetPodCastsQuery(null, null));
            }
            catch { podCasts = []; }

            return new GetAllMediaResponse(
                movies,
                series,
                corus,
                tracks,
                albums,
                magazines,
                newsPapers,
                audioStories,
                books,
                podCasts
            );

        }
    }
}
