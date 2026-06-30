
using EntertainmentApp.Application.Interfaces;
using EntertainmentApp.Domain.Entities.Music;
using EntertainmentApp.Domain.Entities.Story;

namespace EntertainmentApp.Application.Features.Music.TrackFeatur
{
    public record GetTracksQuery(string Language, string Genre) : IQuery<List<TrackDto>>;

    public class GetTracksHandler(IMusicRepository musicRepo) : IQueryHandler<GetTracksQuery, List<TrackDto>>
    {
        public async Task<List<TrackDto>> Handle(GetTracksQuery request, CancellationToken cancellationToken)
        {
            List<Track> tracks = null;
            if (!string.IsNullOrEmpty(request.Language) && string.IsNullOrEmpty(request.Genre))
                tracks = await musicRepo.GetTracksByLanguage(request.Language);
            else if (!string.IsNullOrEmpty(request.Language) && !string.IsNullOrEmpty(request.Genre))
                tracks = await musicRepo.GetTrackByFilterAsync(request.Language, request.Genre);
            else if (string.IsNullOrEmpty(request.Language) && !string.IsNullOrEmpty(request.Genre))
                tracks = await musicRepo.GetTracksByLanguage(request.Language);
            else tracks = await musicRepo.GetTracksAsync();

            if (tracks == null || !tracks.Any())
                throw new NotFoundException("Track Not found");

            List<TrackDto> result = tracks.Select(m => m.ToTrackDto()).ToList();

            return result;
        }
    }
}
