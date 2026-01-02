using EntertainmentApp.Applicatoin.Interfaces;

namespace EntertainmentApp.Applicatoin.Features.Music.TrackFeatur
{
    public record GetTrackByIdQuery(Guid TrackId) : IQuery<TrackDto?>;
    public class GetTrackByIdHandler : IQueryHandler<GetTrackByIdQuery, TrackDto?>
    {
        private readonly IMusicRepository _musicRepository;
        public GetTrackByIdHandler(IMusicRepository musicRepository)
        {
            _musicRepository = musicRepository;
        }
        public async Task<TrackDto?> Handle(GetTrackByIdQuery request, CancellationToken cancellationToken)
        {
            var track = await _musicRepository.GetTrackByIdAsync(request.TrackId);
            if (track == null) throw new NotFoundException("Music not found");
            return track.ToTrackDto();
        }
    }
}
