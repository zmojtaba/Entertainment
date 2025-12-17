
using EntertainmentApp.Applicatoin.Features.Video.MoviesFeature;
using EntertainmentApp.Applicatoin.Features.Video.SeriesFeature;

namespace EntertainmentApp.Shared.Behaviors
{
    public class MovieValidationCleanupBehavior<TRequest, TResponse>
        : IPipelineBehavior<TRequest, TResponse>
    {

        private readonly IMediaService _mediaService;
        private readonly IConfiguration _config;
        public MovieValidationCleanupBehavior(IMediaService mediaService, IConfiguration config)
        {
            _mediaService = mediaService;
            _config = config;
        }

        public async Task<TResponse> Handle(
            TRequest request,
            RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken)
        {
            try
            {
                return await next(); // run validator → handler
            }
            catch (ValidationException)
            {
                if (request is CreateMovieHandler.CreateMovieCommand cmd)
                {
                    // cleanup files if validation failed
                    await _mediaService.DeleteMediaFilesAsync(
                        cmd.TempStreamUrl ?? "",
                        cmd?.TempPosterImageUrl ?? "",
                        true
                    );
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(cmd.TempStreamUrl), true);
                }

                if (request is CreateSeriesCommand cmmd)
                {
                    await _mediaService.DeleteMediaFilesAsync(
                        cmmd.PosterImageUrl,
                        ""
                    );
                }



                throw; // rethrow validation error
            }
        }
    }

}
