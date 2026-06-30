
namespace EntertainmentApp.Application.Features.CoruFeature
{
    public record DeleteCoruCommand(Guid Id) : ICommand;
    public class DeleteCoruHandler(ICoruRepository coruRepository, IMediaService mediaService) : ICommandHandler<DeleteCoruCommand>
    {
            public async Task<Unit> Handle(DeleteCoruCommand command, CancellationToken cancellationToken)
            {
                Coru coru = await coruRepository.GetCoruByIdAsync(command.Id);
                if (coru == null) throw new NotFoundException("Coru Not Found");
                await mediaService.DeleteFileAsync(coru.StreamUrl, true);
                await coruRepository.DeleteCoruAsync(coru);
                return Unit.Value;
            }
    }
}
