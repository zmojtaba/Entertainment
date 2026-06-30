namespace Entertainment.Server.Applicatoin.Features.Video.MoviesFeature
{
    public record DeleteMovieCommand(Guid Id) : ICommand<bool>;

    public class DeleteMovieHandler(IMovieRepository movieRepo, IMediaService mediaService) : ICommandHandler<DeleteMovieCommand, bool>
    {
        public async Task<bool> Handle(DeleteMovieCommand request, CancellationToken cancellationToken)
        {
            Movie movie = await movieRepo.GetMovieByIdAsync(request.Id);
            if (movie == null) throw new NotFoundException("Movie not found");
            try
            {
                await mediaService.DeleteFileAsync(movie.StreamUrl, true);
                await mediaService.DeleteFileAsync(movie.PosterImageUrl, true);
                await mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(movie.StreamUrl), true);
            }
            catch (Exception ex) {
                throw new InternalServerException(ex.Message);
            }

            await movieRepo.DeleteMovieAsync(movie);
            return true;
            

        }
    }
}
