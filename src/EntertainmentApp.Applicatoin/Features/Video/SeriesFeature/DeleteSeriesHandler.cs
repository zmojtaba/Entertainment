


namespace EntertainmentApp.Applicatoin.Features.Video.SeriesFeature
{
    public record DeleteSeriesCommand(Guid Id) : ICommand;
    public class DeleteSeriesHandler(ISeriesRepository seriesRepo, IMediaService mediaService) : ICommandHandler<DeleteSeriesCommand>
    {
        public async Task<Unit> Handle(DeleteSeriesCommand request, CancellationToken cancellationToken)
        {
            Series series = await seriesRepo.GetSeriesByIdAsync(request.Id);
            if (series == null) throw new NotFoundException("Series Not found");

            await mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(series.PosterImageUrl), true);

            await seriesRepo.DeleteSeriesAsync(series);
            await mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(series.PosterImageUrl), true);
            return Unit.Value;
        }
    }
}
