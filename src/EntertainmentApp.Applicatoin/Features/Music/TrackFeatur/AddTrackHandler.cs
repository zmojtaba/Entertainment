using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Music;
using EntertainmentApp.Domain.Entities.Story;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static EntertainmentApp.Applicatoin.Features.Story.BookFeature.AddBookHandler;

namespace EntertainmentApp.Applicatoin.Features.Music.TrackFeatur
{
    public class AddTrackHandler
    {
        public class AddTrackCommand : ICommand<TrackDto>
        {
            public string Title { get; set; }
            public string Singer { get; set; }
            public List<string> Genres { get; set; }
            public List<string> Languages { get; set; }
            public string TempPosterImageUrl { get; set; } = string.Empty;
            public string PosterImageFileName { get; set; } = string.Empty;
            public string TempStreamUrl { get; set; } = string.Empty;
            public string StreamFileName { get; set; } = string.Empty;
        }

        public class AddTrackCommandValidator : AbstractValidator<AddTrackCommand>
        {
            public AddTrackCommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
                RuleFor(x => x.TempStreamUrl).NotEmpty().WithMessage("Media is required");
                RuleFor(x => x.TempPosterImageUrl).NotEmpty().WithMessage("Poster image is required");
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

                RuleFor(x => x.StreamFileName)
                    .NotEmpty().WithMessage("Media file must be valid.")
                    .Must(x => ValidExtensionList.BookExtension.Contains(Path.GetExtension(x), StringComparer.OrdinalIgnoreCase))
                    .WithMessage($"Invalid ebook file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.AudioExtension)}");
                RuleFor(x => x.PosterImageFileName).NotEmpty().WithMessage("Poster Image must be valid.")
                    .Must(x => ValidExtensionList.ImageExtension.Contains(Path.GetExtension(x), StringComparer.OrdinalIgnoreCase))
                    .WithMessage($"Invalid image file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.ImageExtension)}");
            }
        }

        public class AddMusicCommandHandler(IMediaService mediaService, IMusicRepository musicRepo) : ICommandHandler<AddTrackCommand, TrackDto>
        {
            public async Task<TrackDto> Handle(AddTrackCommand command, CancellationToken cancellationToken)
            {
                string posterImagePath = await mediaService.MovePosterImage(command.TempPosterImageUrl, command.Singer, "music", "track");
                string streamPath = await mediaService.MoveStreamToExistenceDirectoryAsync(command.TempStreamUrl,
                    Path.GetDirectoryName(posterImagePath));

                Track track = new Track(
                    command.Title,
                    LanguageList.Languages
                        .Where(x => command.Languages
                            .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                        .ToList(),
                    streamPath,
                    posterImagePath
                    );

                foreach (string g in command.Genres)
                {
                    Genre? genre = await musicRepo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = await musicRepo.AddGenreAsync(new Genre(g));

                    }
                    track.AddGenre(genre);
                }

                Singer? singer = await musicRepo.GetSingerAsync(command.Singer);
                if (singer == null)
                {
                    singer = await musicRepo.AddSingerAsync(new Singer(command.Singer));
                }
                track.SetSinger(singer);

                try
                {
                    await musicRepo.AddTrackAsync(track);
                }
                catch (DbUpdateException ex)
                {
                    await mediaService.DeleteMediaFilesAsync(track.StreamUrl, track.PosterImageUrl, true)
                    if (ex.InnerException.Message.IndexOf("duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase) >= 0)
                        throw new BadRequestException("Book with this Title and Pusblish Date is already exists");
                    throw;

                }

                return track.ToTrackDto();
            }



        }
    }
}
