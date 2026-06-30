using EntertainmentApp.Domain.Entities.Music;

namespace EntertainmentApp.Application.Common.Mappers
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
                Languages = track.Languages,
                StreamUrl = track.StreamUrl,
                PosterImageUrl = track.PosterImageUrl,
                Genres = track.Genres.Select(g => g.Title).ToList(),
                Singer = track.Singer.ToSingerDto()
            };
        }

        public static SingerDto ToSingerDto(this Singer singer)
        {
            return new SingerDto
            {
                Name = singer.Name,
                ImagePath = singer.ImagePath
            };
        }

        public static AlbumDto ToAlbumDto(this Album album)
        {
            return new AlbumDto
            {
                Id = album.Id,
                Title = album.Title,
                Languages = album.Languages,
                PosterImageUrl = album.PosterImageUrl,
                Genres = album.Genres.Select(g => g.Title).ToList(),
                Singer = album.Singer.ToSingerDto(),
                Episodes = album.Episodes.Select(e => e.ToAlbumEpisodeDto()).ToList()
            };
        }
        public static AlbumEpisodeDto ToAlbumEpisodeDto(this AlbumEpisode episode)
        {
            return new AlbumEpisodeDto
            {
                Id = episode.Id,
                Title = episode.Title,
                StreamUrl = episode.StreamUrl,
            };
        }

    }
}
