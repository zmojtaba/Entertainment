using Entertainment.Server.Applicatoin.Interfaces;
using Entertainment.Server.Domain.Entities.Publication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entertainment.Server.Applicatoin.Features.Publication.MagazineFeature
{

    public record DeleteMagazineCommand(Guid Id) : ICommand;
    public class DeleteMagazineHandler : ICommandHandler<DeleteMagazineCommand>
    {
        private readonly IPublicationRepository _publicationRepository;
        private readonly IMediaService _mediaService;
        public DeleteMagazineHandler(IPublicationRepository publicationRepository, IMediaService mediaService)
        {
            _publicationRepository = publicationRepository;
            _mediaService = mediaService;
        }
        public async Task<Unit> Handle(DeleteMagazineCommand command, CancellationToken cancellationToken)
        {
            Magazine? paper = await _publicationRepository.GetMagazineByIdAsync(command.Id);
            if (paper == null) throw new NotFoundException("Magazine not found");
            await _mediaService.DeleteFileAsync(paper.StreamUrl, true);
            await _mediaService.DeleteFileAsync(paper.PosterImageUrl, true);
            await _publicationRepository.DeleteMagazineAsync(paper);
            return Unit.Value;

        }
    }

}
