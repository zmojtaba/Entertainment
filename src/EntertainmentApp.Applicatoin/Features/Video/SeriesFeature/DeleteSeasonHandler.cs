
namespace EntertainmentApp.Applicatoin.Features.Video.SeriesFeature
{
    public class DeleteSeasonHandler
    {
        public record DeleteSeasonCommand(Guid id): ICommand<string>;
        public class DeleteSeasonCommandHandler(ISeriesRepository seriesRepo, IMediaService mediaService) : ICommandHandler<DeleteSeasonCommand, string>
        {
            public async Task<string> Handle(DeleteSeasonCommand request, CancellationToken cancellationToken)
            {
                Season season = await seriesRepo.GetSeasonByIdAsync(request.id);
                if (season == null) throw new NotFoundException("Season Not found");
                foreach(var episode in season.Episodes)
                {
                    await mediaService.DeleteMediaFilesAsync(episode.StreamUrl, "", true);
                }

                await seriesRepo.DeleteSeasonAsync(season);

                return "Successfully deleted";
            }
        }
    }
}
