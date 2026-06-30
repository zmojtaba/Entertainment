using Entertainment.Server.Applicatoin.Interfaces;
using Entertainment.Server.Domain.Entities.Music;
using Entertainment.Server.Domain.Entities.Story;
using System.Linq;
using static Entertainment.Server.Applicatoin.Features.Music.TrackFeatur.AddTrackHandler;

namespace Entertainment.Server.Applicatoin.Features.Music.TrackFeatur
{
    public class UpdateTrackCommand : ICommand<TrackDto>
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public string? PosterImageUrl { get; set; } = string.Empty;
        public List<string> Genres { get; set; } = new List<string>();
        public string Singer { get; set; } = string.Empty;
    }

    public class UpdateTrackCommandValidator : AbstractValidator<UpdateTrackCommand>
    {
        public UpdateTrackCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.Singer).NotEmpty().WithMessage("Singer Name is required");

            RuleFor(x => x.Genres)
            .NotNull().WithMessage("Genre is required");
            RuleForEach(x => x.Genres).NotEmpty().WithMessage("Genre can not contains empty string");


            RuleFor(x => x.Languages)
                .NotNull().WithMessage("Language is required");
            RuleForEach(x => x.Languages)
                .NotEmpty().WithMessage("Language can not contains empty string")
                .Must(l => LanguageList.Languages.Contains(l, StringComparer.OrdinalIgnoreCase))
                .WithMessage("Language {PropertyValue} is not supported.");
        }
    }


    public class UpdateTrackHandler : ICommandHandler<UpdateTrackCommand, TrackDto>
    {
        private readonly IMusicRepository _musicRepository;
        private readonly IMediaService _mediaService;
        private readonly IConfiguration _config;
        public UpdateTrackHandler(IMusicRepository musicRepository, IMediaService mediaService, IConfiguration config)
        {
            _musicRepository = musicRepository;
            _mediaService = mediaService;
            _config = config;
        }
        public async Task<TrackDto> Handle(UpdateTrackCommand command, CancellationToken cancellationToken)
        {
            Track? track = await _musicRepository.GetTrackByIdAsync(command.Id);
            if (track == null) throw new NotFoundException("Track not found");
            track.SetTitle(command.Title);
            track.SetLanguages(LanguageList.Languages
                .Where(x => command.Languages
                    .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                .ToList());
            if (!string.IsNullOrEmpty(command.PosterImageUrl))
            {
                string posterImageUrl = await _mediaService.MoveStreamToExistenceDirectoryAsync(
                        command.PosterImageUrl,
                        Path.GetDirectoryName(track.PosterImageUrl));

                await _mediaService.DeleteFileAsync(track.PosterImageUrl, true);
                track.SetPosterImageUrl(posterImageUrl);
            }

            track.RemoveGenres();
            foreach (string g in command.Genres)
            {
                Genre? genre = await _musicRepository.GetGenreAsync(g);
                if (genre == null)
                {
                    genre = await _musicRepository.AddGenreAsync(new Genre(g));
                    genre.AddCategory("music");
                }
                track.AddGenre(genre);
            }

            if ( !command.Singer.Equals(track.Singer?.Name, StringComparison.OrdinalIgnoreCase))
            {
                Singer? singer = await _musicRepository.GetSingerAsync(command.Singer);
                if (singer == null)
                {
                    singer = await _musicRepository.AddSingerAsync(new Singer(command.Singer));
                }
                string newPosterPath = await _mediaService.MovePosterImage(
                        Path.Combine(_config["BaseStoragePath"], track.PosterImageUrl), 
                        command.Singer, "music", "track");
                string newStreamPath = await _mediaService.MoveStreamToExistenceDirectoryAsync(
                    Path.Combine(_config["BaseStoragePath"], track.StreamUrl),
                    Path.GetDirectoryName(newPosterPath));

                track.SetStreamUrl(newStreamPath);
                track.SetPosterImageUrl(newPosterPath);

                track.SetSinger(singer);
            }


            await _musicRepository.UpdateTrackAsync(track);
            return track.ToTrackDto();
        }
    }
}
