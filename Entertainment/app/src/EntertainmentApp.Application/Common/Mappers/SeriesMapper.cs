using EntertainmentApp.Domain.Entities.Video;

namespace EntertainmentApp.Application.Common.Mappers
{
    public static class SeriesMapper
    {
        public static EpisodeDto ToEpisodeDto(this Episode episode)
        {
            return new EpisodeDto
            {
                Id = episode.Id,
                EpisodeNumber = episode.EpisodeNumber,
                StreamUrl = episode.StreamUrl,
                SubtitleUrl = episode.SubtitleUrl

            };
        }

        public static SeasonDto ToSeasonDto(this Season season)
        {
            return new SeasonDto
            {
                Id = season.Id,
                SeasonNumber = season.SeasonNumber,
                Episodes = season.Episodes.Select(e => e.ToEpisodeDto()).ToList(),

            };

        }

        public static SeriesDto ToSeriesDto(this Series series)
        {
            return new SeriesDto
            {
                Id = series.Id,
                Title = series.Title,
                Description = series.Description,
                ImdbRating = series.ImdbRating,
                PublishedDate = series.PublishedDate,
                Countries = series.Countries,
                Languages = series.Languages,
                AgeGroup = series.AgeGroup,
                Genres = series.Genres.Select(g => g.Title).ToList(),
                Directors = series.Directors.Select(d => new DirectorDto { Name = d.Name, ImagePath = d.ImagePath }).ToList(),
                Actors = series.Actors.Select(a => new ActorDto { Name = a.Name, ImagePath = a.ImagePath }).ToList(),
                PosterImageUrl = series.PosterImageUrl,
                Seasons = series.Seasons?
                        .Select(s => s.ToSeasonDto())
                        .ToList()
                        ?? new List<SeasonDto>(),
            };
        }
    }
}
