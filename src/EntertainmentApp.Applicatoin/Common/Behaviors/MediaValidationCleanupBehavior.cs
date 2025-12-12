using MediatR;
using FluentValidation;
using EntertainmentApp.Applicatoin.Features.Movies.Command;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using Microsoft.Extensions.Configuration;

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
                    //string posterImagePath = Path.Combine(_config["BaseStoragePath"], cmd.PosterImageUrl);
                    //string streamPath = Path.Combine(_config["BaseStoragePath"], cmd.StreamUrl);
                    // cleanup files if validation failed
                    await _mediaService.DeleteMediaFilesAsync(
                        cmd.StreamUrl,
                        cmd.PosterImageUrl,
                        true
                    );
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(cmd.StreamUrl), true);
                }

                throw; // rethrow validation error
            }
        }
    }

}
