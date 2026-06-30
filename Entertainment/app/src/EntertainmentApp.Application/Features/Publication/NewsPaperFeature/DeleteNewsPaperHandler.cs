using EntertainmentApp.Application.Interfaces;
using EntertainmentApp.Application.Interfaces.Media;
using EntertainmentApp.Domain.Entities.Music;
using EntertainmentApp.Domain.Entities.Publication;

namespace EntertainmentApp.Application.Features.Publication.NewsPaperFeature
{
    public record DeleteNewsPaperCommand(Guid Id) : ICommand;
    public class DeleteNewsPaperHandler : ICommandHandler<DeleteNewsPaperCommand>
    {
        private readonly IPublicationRepository _publicationRepository;
        private readonly IMediaService _mediaService;
        public DeleteNewsPaperHandler(IPublicationRepository publicationRepository, IMediaService mediaService)
        {
            _publicationRepository = publicationRepository;
            _mediaService = mediaService;
        }
        public async Task<Unit> Handle(DeleteNewsPaperCommand command, CancellationToken cancellationToken)
        {
            NewsPaper? paper = await _publicationRepository.GetNewsPaperByIdAsync(command.Id);
            if (paper == null) throw new NotFoundException("NewsPaper not found");
            await _mediaService.DeleteFileAsync(paper.StreamUrl, true);
            await _mediaService.DeleteFileAsync(paper.PosterImageUrl, true);
            await _publicationRepository.DeleteNewsPaperAsync(paper);
            return Unit.Value;

        }
    }
}
