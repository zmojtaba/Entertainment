namespace EntertainmentApp.Application.Common.Models
{
    public record GetAllMediaResponse(List<MovieDto>? Movies, 
        List<SeriesDto>? Series, 
        List<TrackDto>? Tracks, 
        List<AlbumDto>? Albums,
        List<BookDto>?  Books,
        List<AudioStoryDto>? AudioStories,
        List<PodCastDto> PodCasts,
        List<MagazineDto> Magazines,
        List<NewsPaperDto> NewsPapers,
        List<CoruDto> Corus
        );
}
