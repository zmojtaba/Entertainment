using Entertainment.Server.Applicatoin.Interfaces;
using Entertainment.Server.Domain.Entities.Music;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Entertainment.Server.Applicatoin.Features.Music.AlbumFeature
{
    public class UpdateAlbumCommand : ICommand<AlbumDto>
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public string? PosterImageUrl { get; set; } = null;
        public List<string> Genres { get; set; } = new List<string>();
        public string Singer { get; set; } = string.Empty;
    }

    public class UpdateAlbumCommandValidator : AbstractValidator<UpdateAlbumCommand>
    {
        public UpdateAlbumCommandValidator()
        {
            RuleFor(x => x.Id).NotNull().WithMessage("Id is required.");
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.Languages).NotEmpty().WithMessage("At least one language is required.");
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

    public class UpdateAlbumHandler : ICommandHandler<UpdateAlbumCommand, AlbumDto>
    {

        private readonly IMusicRepository _musicRepository;
        private readonly IMediaService _mediaService;
        private readonly IConfiguration _config;
        public UpdateAlbumHandler(IMusicRepository musicRepository, IMediaService mediaService, IConfiguration config)
        {
            _musicRepository = musicRepository;
            _mediaService = mediaService;
            _config = config;
        }

        public async Task<AlbumDto> Handle(UpdateAlbumCommand command, CancellationToken cancellationToken)
        {
            Album? album = await _musicRepository.GetAlbumByIdAsync(command.Id);
            if (album == null) throw new NotFoundException("Album not found");
            album.SetTitle(command.Title);
            album.SetLanguages(LanguageList.Languages
                .Where(x => command.Languages
                    .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                .ToList());
            if (!string.IsNullOrEmpty(command.PosterImageUrl))
            {
                string posterImageUrl = await _mediaService.MoveStreamToExistenceDirectoryAsync(
                        command.PosterImageUrl,
                        Path.GetDirectoryName(album.PosterImageUrl));

                await _mediaService.DeleteFileAsync(album.PosterImageUrl, true);
                album.SetPosterImageUrl(posterImageUrl);
            }

            album.RemoveGenres();
            foreach (string g in command.Genres)
            {
                Genre? genre = await _musicRepository.GetGenreAsync(g);
                if (genre == null)
                {
                    genre = await _musicRepository.AddGenreAsync(new Genre(g));
                    genre.AddCategory("music");
                }
                album.AddGenre(genre);
            }

            if (!command.Singer.Equals(album.Singer?.Name, StringComparison.OrdinalIgnoreCase))
            {
                Singer? singer = await _musicRepository.GetSingerAsync(command.Singer);
                if (singer == null)
                {
                    singer = await _musicRepository.AddSingerAsync(new Singer(command.Singer));
                }
                string newPosterPath = await _mediaService.MovePosterImage(
                        Path.Combine(_config["BaseStoragePath"], album.PosterImageUrl),
                        command.Singer, "music", "album");


                string newStreamPath = Path.GetDirectoryName(newPosterPath);

                //album.SetStreamUrl(newStreamPath);
                album.SetPosterImageUrl(newPosterPath);
                try
                {
                    foreach (AlbumEpisode episode in album.Episodes)
                    {
                        string episodeNewStreamPath = await _mediaService.MoveStreamToExistenceDirectoryAsync(
                            Path.Combine(_config["BaseStoragePath"], episode.StreamUrl),
                            Path.GetDirectoryName(newPosterPath));
                        episode.SetStreamUrl(episodeNewStreamPath);
                        await _musicRepository.UpdateAlbumEpisodeAsync(episode);
                    }
                }
                catch(Exception ex)
                {
                    throw new InternalServerException(ex.Message);
                }

                album.SetSinger(singer);
            }


            await _musicRepository.UpdateAlbumAsync(album);
            return album.ToAlbumDto();
        }
    }
}
