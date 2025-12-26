using EntertainmentApp.Domain.Entities.Music;

namespace EntertainmentApp.Applicatoin.Common.Mappers
{
    public static class TrackMapper
    {
        public static TrackDto ToTrackDto(this Track track)
        {
            if (track == null) return null;
            return new TrackDto
            {
                Id = track.Id,
                Title = track.Title,
                Language = track.Languages,
                StreamUrl = track.StreamUrl,
                PosterImageUrl = track.PosterImageUrl,
                Genres = track.Genres.Select(g => g.Title).ToList(),
                Singer = track.Singer.ToTrackSingerDto()
            };
        }

        public static TrackSingerDto ToTrackSingerDto(this Singer singer)
        {
            return new TrackSingerDto
            {
                Name = singer.Name,
                ImagePath = singer.ImagePath
            };
        }

    }
}
