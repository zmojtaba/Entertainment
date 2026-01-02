using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Music;

namespace EntertainmentApp.Applicatoin.Features.Music.AlbumFeature
{
    public class AddAlbumEpisodeCommand : ICommand<AlbumDto>
    {
        public Guid AlbumId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string TempStreamUrl { get; set; } = string.Empty;
    }
    public class AddAlbumEpisodeCommandValidator : AbstractValidator<AddAlbumEpisodeCommand>
    {
        public AddAlbumEpisodeCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.AlbumId).NotEmpty().NotNull().WithMessage("Id is required");
            RuleFor(x => x.TempStreamUrl).NotEmpty().WithMessage("Media file url is required");
        }
    }
    public class AddAlbumEpisodeHandler : ICommandHandler<AddAlbumEpisodeCommand, AlbumDto>
    {
        private readonly IMusicRepository _musicRepository;
        private readonly IMediaService _mediaService;
        public AddAlbumEpisodeHandler(IMusicRepository musicRepository, IMediaService mediaService)
        {
            _musicRepository = musicRepository;
            _mediaService = mediaService;
        }
        public async Task<AlbumDto> Handle(AddAlbumEpisodeCommand command, CancellationToken cancellationToken)
        {
            Album? album = await _musicRepository.GetAlbumByIdAsync(command.AlbumId);
            if (album == null)
            {
                await _mediaService.DeleteFileAsync(command.TempStreamUrl);
                throw new NotFoundException("Album Not found");
            }
            string streamUrl = await _mediaService.MoveStreamToExistenceDirectoryAsync(
                    command.TempStreamUrl,
                    Path.GetDirectoryName(album.PosterImageUrl));
            AlbumEpisode episode = new AlbumEpisode(command.Title, streamUrl);
            try
            {
                await _musicRepository.AddAlbumEpisodeAsync(episode);
            }
            catch (DbUpdateException ex)
            {
                await _mediaService.DeleteFileAsync(episode.StreamUrl, true);
                if (ex.InnerException.Message.IndexOf("duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase) >= 0)
                    throw new BadRequestException("Album Episode with the same title already exists.");
                throw;
            }
            catch (Exception ex)
            {
                throw new InternalServerException(ex.Message);
            }
            album.AddEpisode(episode);
            await _musicRepository.UpdateAlbumAsync(album);
            return album.ToAlbumDto();
        }
    }
}
