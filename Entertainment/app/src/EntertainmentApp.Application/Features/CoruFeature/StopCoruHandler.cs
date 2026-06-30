namespace EntertainmentApp.Application.Features.CoruFeature
{
    public record StopCoruCommand(Guid Id) : IQuery<bool>;
    public class StopCoruHandler(ICoruRepository coruRepo, IAudioPlayerService _audioPlayer, IConfiguration config) : IQueryHandler<StopCoruCommand, bool>
    {
        public async Task<bool> Handle(StopCoruCommand request, CancellationToken cancellationToken)
        {
            Coru coru = await coruRepo.GetCoruByIdAsync(request.Id);
            if (coru == null) throw new NotFoundException("Coru Not Found");
            _audioPlayer.Stop();
            return await Task.FromResult(true);
        }
        
    }
}
