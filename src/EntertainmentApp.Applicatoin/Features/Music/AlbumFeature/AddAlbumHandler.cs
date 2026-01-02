using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using EntertainmentApp.Domain.Entities.Music;
using EntertainmentApp.Domain.Entities.Story;
using Microsoft.EntityFrameworkCore.Migrations;

namespace EntertainmentApp.Applicatoin.Features.Music.AlbumFeature
{
    public class AddAlbumCommand : ICommand<AlbumDto>
    {
        public string Title { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public string PosterImageUrl { get; set; } = string.Empty;
        public List<string> Genres { get; set; } = new List<string>();
        public string Singer { get; set; } = string.Empty;
    }
    public class AddAlbumCommandValidator : AbstractValidator<AddAlbumCommand>
    {
        public AddAlbumCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.Languages).NotEmpty().WithMessage("At least one language is required.");
            RuleFor(x => x.PosterImageUrl).NotEmpty().WithMessage("Poster image URL is required.");
            RuleFor(x => x.Singer).NotEmpty().WithMessage("Singer is required.");
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


    public class AddAlbumHandler: ICommandHandler<AddAlbumCommand, AlbumDto>
    {
        private readonly IMusicRepository _musicRepository;
        private readonly IMediaService _mediaService;
        public AddAlbumHandler(IMusicRepository musicRepository, IMediaService mediaService)
        {
            _musicRepository = musicRepository;
            _mediaService = mediaService;
        }
        public async Task<AlbumDto> Handle(AddAlbumCommand command, CancellationToken cancellationToken)
        {
            if (!File.Exists(command.PosterImageUrl))
                throw new BadRequestException("Poster image file was not stored. try again");
            string posterImageUrl = null;
            try
            {
                posterImageUrl = await _mediaService.MovePosterImage(command.PosterImageUrl, command.Singer, "music", "album");
            }
            catch (Exception ex)
            {
                await _mediaService.DeleteFileAsync(command.PosterImageUrl);
                throw new InternalServerException(ex.Message);
            }

            // Create PodCast entity
            Album album = new Album(
                command.Title,
                LanguageList.Languages
                    .Where(x => command.Languages
                        .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                    .ToList(),
                posterImageUrl
            );
            // Handle Genres
            foreach (string genreTitle in command.Genres)
            {
                Genre genre = await _musicRepository.GetGenreAsync(genreTitle);
                if (genre == null)
                {
                    genre = new Genre(genreTitle);
                    genre = await _musicRepository.AddGenreAsync(genre);
                }
                album.Genres.Add(genre);
            }
            // Handle Speakers
            Singer? singer = await _musicRepository.GetSingerAsync(command.Singer);
            if (singer == null)
            {
                singer = await _musicRepository.AddSingerAsync(new Singer(command.Singer));
            }
            album.SetSinger(singer);

            try
            {
                await _musicRepository.AddAlbumAsync(album);
            }
            catch (DbUpdateException ex)
            {
                await _mediaService.DeleteFileAsync(album.PosterImageUrl, true);
                if (ex.InnerException.Message.IndexOf("duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase) >= 0)
                    throw new BadRequestException(ex.Message);
                throw;

            }
            return album.ToAlbumDto();
        }
    }
}
