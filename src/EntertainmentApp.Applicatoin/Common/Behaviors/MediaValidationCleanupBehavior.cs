
using EntertainmentApp.Applicatoin.Features.Music.AlbumFeature;
using EntertainmentApp.Applicatoin.Features.Publication.NewsPaperFeature;
using EntertainmentApp.Applicatoin.Features.Story.PodCastFeature;
using EntertainmentApp.Applicatoin.Features.Video.MoviesFeature;
using EntertainmentApp.Applicatoin.Features.Video.SeriesFeature;
using static EntertainmentApp.Applicatoin.Features.Music.TrackFeatur.AddTrackHandler;
using static EntertainmentApp.Applicatoin.Features.Story.AudioStoryFeature.AddAudioStoryEpisodeHandler;
using static EntertainmentApp.Applicatoin.Features.Story.AudioStoryFeature.AddAudioStoryHandler;
using static EntertainmentApp.Applicatoin.Features.Story.BookFeature.AddBookHandler;
using static EntertainmentApp.Applicatoin.Features.Story.PodCastFeature.AddPodCastEpisodeHandler;
using static EntertainmentApp.Applicatoin.Features.Story.PodCastFeature.AddPodCastHandler;
using static EntertainmentApp.Applicatoin.Features.Video.SeriesFeature.CreateSeasonHandler;

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
                    await _mediaService.DeleteFileAsync(
                        cmd.TempStreamUrl ?? ""
                    );
                    await _mediaService.DeleteFileAsync(
                        cmd?.TempPosterImageUrl ?? ""
                    );
                    await _mediaService.DeleteFileAsync(
                        cmd?.TempSubtitleUrl ?? ""
                    );
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(cmd.TempStreamUrl), true);
                }

                if (request is CreateSeriesCommand cmmd)
                {
                    await _mediaService.DeleteFileAsync(
                        cmmd.PosterImageUrl
                    );
                }

                if (request is CreateSeasonCommand createSeasonCommand)
                {
                    await _mediaService.DeleteFileAsync(createSeasonCommand.TempStreamUrl ?? "") ;
                    await _mediaService.DeleteFileAsync(createSeasonCommand.TempSubtitleUrl ?? "");
                }

                if (request is AddBookCommand bookCommand)
                {
                    await _mediaService.DeleteFileAsync(bookCommand.TempStreamUrl);
                    await _mediaService.DeleteFileAsync(bookCommand.TempPosterImageUrl);
                }

                if (request is AddCodCastCommand podcastCommand)
                {
                    await _mediaService.DeleteFileAsync(podcastCommand.PosterImageUrl);
                }

                if (request is AddPodCastEpisodeCommand podcastEpisodeCommand)
                {
                    await _mediaService.DeleteFileAsync(podcastEpisodeCommand.TempStreamUrl);
                }

                if (request is AddAudioStoryCommand audioStoryCommand)
                {
                    await _mediaService.DeleteFileAsync(audioStoryCommand.PosterImageUrl);
                }

                if (request is AddAudioStoryEpisodeCommand AudioStoryEpisodeCommand)
                {
                    await _mediaService.DeleteFileAsync(AudioStoryEpisodeCommand.TempStreamUrl);
                }

                if (request is AddTrackCommand trackCommand)
                {
                    await _mediaService.DeleteFileAsync( trackCommand.TempPosterImageUrl);
                    await _mediaService.DeleteFileAsync(trackCommand.TempStreamUrl);
                }
                if (request is AddAlbumCommand albumCommand)
                {
                    await _mediaService.DeleteFileAsync(albumCommand.PosterImageUrl);
                }
                if (request is AddAlbumEpisodeCommand albumEpisodeCommand)
                {
                    await _mediaService.DeleteFileAsync(albumEpisodeCommand.TempStreamUrl);
                }

                if (request is AddNewsPaperCommand newsPaperCommand)
                {
                    await _mediaService.DeleteFileAsync(newsPaperCommand.TempStreamUrl);
                    await _mediaService.DeleteFileAsync(newsPaperCommand.TempPosterImageUrl);
                }

                throw; // rethrow validation error
            }
        }
    }

}
