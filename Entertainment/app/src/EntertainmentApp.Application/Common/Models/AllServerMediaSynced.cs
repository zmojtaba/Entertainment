namespace EntertainmentApp.Application.Common.Models
{
    public class AllServerMediaSynced
    {
        public List<MovieDto> Movies { get; set; }
        public List<SeriesDto> Series { get; set; }
        public List<TrackDto>  TrackDtos { get; set; }
    }
}
