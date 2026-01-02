
namespace EntertainmentApp.Applicatoin.Features.Video.SeriesFeature
{
    public class DeleteEpisodeHandler
    {

        public record DeleteEpisodeCommand(Guid id) : ICommand<string>;

        public class DeleteEpisodeCommandHandler(ISeriesRepository seriesRepo, IMediaService mediaService): ICommandHandler<DeleteEpisodeCommand, string>
        {
            public async Task<string> Handle(DeleteEpisodeCommand request, CancellationToken cancellationToken)
            {
                Episode episode = await seriesRepo.GetEpisodeByIdAsync(request.id);
                if (episode == null) throw new NotFoundException("Series Not found");
                await mediaService.DeleteFileAsync(episode.StreamUrl, true);
                return "Successfully Deleted";
            }
        }
    }
}
