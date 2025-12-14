using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Video.DeleteMovie
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
                await mediaService.DeleteMediaFilesAsync(movie.StreamUrl, movie.PosterImageUrl, true);
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
