namespace Entertainment.Server.Applicatoin.Features.CoruFeature
{
    public record PlayCoruCommand(Guid Id) : IQuery<bool>;
    public class PlayCoruHandler(ICoruRepository _coruRepository,
            IAudioPlayerService _audioPlayer,
            IConfiguration config) : IQueryHandler<PlayCoruCommand, bool>
    {
        public async Task<bool> Handle(PlayCoruCommand request, CancellationToken cancellationToken)
        {
            Coru coru = await _coruRepository.GetCoruByIdAsync(request.Id);
            if (coru == null) throw new NotFoundException("Coru Not Found");
            _audioPlayer.Play(Path.Combine(config["BaseStoragePath"], coru.StreamUrl));
            return true;

        }
        
    }
}
