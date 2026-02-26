using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Video.SeriesFeature
{
    public class CreateSeasonHandler
    {
        public record CreateSeasonCommand(Guid SeriesId, int SeasonNumber, int EpisodeNumber, string TempStreamUrl, string TempSubtitleUrl ) : ICommand<SeasonDto>;
        public class CreateSeasonCommandValidator : AbstractValidator<CreateSeasonCommand>
        {
            public CreateSeasonCommandValidator()
            {
                RuleFor(x => x.TempStreamUrl).NotEmpty().WithMessage("Stream URL is required");
                RuleFor(x => x.SeriesId).NotEmpty().WithMessage("Series Id is required");
                RuleFor(x => x.SeasonNumber).GreaterThan(0).WithMessage("Season number must be greater than zero");
                RuleFor(x => x.EpisodeNumber).GreaterThan(0).WithMessage("Episode number must be greater than zero");
            }
        }

        public class CreateSeasonCommandHandler : ICommandHandler<CreateSeasonCommand, SeasonDto>
        {
            private readonly ISeriesRepository _seriesRepository;
            private readonly IMediaService _mediaService;
            public CreateSeasonCommandHandler(ISeriesRepository seriesRepository, IMediaService mediaService)
            {
                _seriesRepository = seriesRepository;
                _mediaService = mediaService;
            }
            public async Task<SeasonDto> Handle(CreateSeasonCommand command, CancellationToken cancellationToken)
            {
                Series series = await _seriesRepository.GetSeriesByIdAsync(command.SeriesId);
                if (series == null)
                {
                    await _mediaService.DeleteFileAsync(command.TempStreamUrl, false);
                    throw new NotFoundException("Series not found");

                }

                Season season = series.Seasons.FirstOrDefault(s => s.SeasonNumber == command.SeasonNumber);
                if (season == null)
                {
                    season = new Season(command.SeasonNumber);
                    season = await _seriesRepository.AddSeasonAsync(season);
                }

                Episode episode = season.Episodes.FirstOrDefault(s => s.EpisodeNumber == command.EpisodeNumber);
                if (episode != null)
                {
                    await _mediaService.DeleteFileAsync(command.TempStreamUrl);
                    await _mediaService.DeleteFileAsync(command.TempSubtitleUrl);

                    throw new BadRequestException("This Episode Exists for this Season");
                }

                string streamUrl = await _mediaService.MoveStreamToExistenceDirectoryAsync(command.TempStreamUrl, Path.GetDirectoryName(series.PosterImageUrl));
                string subtitleUrl = "";
                if (!string.IsNullOrWhiteSpace(command.TempSubtitleUrl)) 
                    subtitleUrl = await _mediaService.MoveStreamToExistenceDirectoryAsync(command.TempSubtitleUrl, Path.GetDirectoryName(series.PosterImageUrl));






                episode = new Episode(command.EpisodeNumber, streamUrl, subtitleUrl);
                episode = await _seriesRepository.AddEpisodeAsync(episode);
                season.AddEpisode(episode);

                season = await _seriesRepository.UpdateSeasonAsync(season);

                series.AddSeason(season);



                await _seriesRepository.UpdateSeriesAsync(series);
                //await _seriesRepository.SaveChangesAsync();
                return season.ToSeasonDto();
            }
        }




    }

}
