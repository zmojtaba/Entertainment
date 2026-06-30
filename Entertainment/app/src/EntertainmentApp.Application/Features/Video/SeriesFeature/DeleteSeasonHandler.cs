
namespace EntertainmentApp.Application.Features.Video.SeriesFeature
{
    public record DeleteSeasonCommand(Guid id): ICommand<string>;
    public class DeleteSeasonHandler(ISeriesRepository seriesRepo, IMediaService mediaService) : ICommandHandler<DeleteSeasonCommand, string>
    {
        public async Task<string> Handle(DeleteSeasonCommand request, CancellationToken cancellationToken)
        {
            Season season = await seriesRepo.GetSeasonByIdAsync(request.id);
            if (season == null) throw new NotFoundException("Season Not found");
            foreach(var episode in season.Episodes)
            {
                await mediaService.DeleteFileAsync(episode.StreamUrl, true);
                await mediaService.DeleteFileAsync(episode.SubtitleUrl, true);
            }

            await seriesRepo.DeleteSeasonAsync(season);

            return "Successfully deleted";
        }
    }
}
