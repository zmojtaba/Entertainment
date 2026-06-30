using EntertainmentApp.Domain.Entities.Story;

namespace EntertainmentApp.Application.Common.Mappers
{
    public static class PodCastMapper
    {
        public static PodCastDto ToPodCastDto(this PodCast podCast)
        {
            return new PodCastDto
            {
                Id = podCast.Id,
                Title = podCast.Title,
                Description = podCast.Description,
                Languages = podCast.Languages,
                AgeGroup = podCast.AgeGroup,
                PosterImageUrl = podCast.PosterImageUrl,
                Genres = podCast.Genres.Select(g => g.Title).ToList(),
                Speakers = podCast.Speakers.Select(s => s.ToSpeaker()).ToList(),
                Episodes = podCast.Episodes.Select(e => e.ToPodCastEpisodeDto()).ToList()
            };
        }
        public static SpeakerDto ToSpeaker(this Speaker speaker)
        {
            return new SpeakerDto
            {
                Name = speaker.Name,
                ImagePath = speaker.ImagePath
            };
        }
        public static PodCastEpisodeDto ToPodCastEpisodeDto(this PodCastEpisode episode)
        {
            return new PodCastEpisodeDto
            {
                Id = episode.Id,
                Title = episode.Title,
                StreamUrl = episode.StreamUrl
            };
        }

    }
}
