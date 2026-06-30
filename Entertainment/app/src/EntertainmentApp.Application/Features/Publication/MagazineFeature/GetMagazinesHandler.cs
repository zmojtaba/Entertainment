
using EntertainmentApp.Application.Interfaces;
using EntertainmentApp.Domain.Entities.Publication;

namespace EntertainmentApp.Application.Features.Publication.MagazineFeature
{
    public record GetMagazinesCommand(string Language, string Genre) : IQuery<List<MagazineDto>>
    {
    }
    public class GetMagazinesHandler(IPublicationRepository publicationRepo) : IQueryHandler<GetMagazinesCommand, List<MagazineDto>>
    {
        public async Task<List<MagazineDto>> Handle(GetMagazinesCommand request, CancellationToken cancellationToken)
        {
            List<Magazine> papers = null;
            if (!string.IsNullOrEmpty(request.Language) && string.IsNullOrEmpty(request.Genre))
                papers = await publicationRepo.GetMagazinesByLanguage(request.Language);
            else if (!string.IsNullOrEmpty(request.Language) && !string.IsNullOrEmpty(request.Genre))
                papers = await publicationRepo.GetMagazinesByFilterAsync(request.Language, request.Genre);
            else if (string.IsNullOrEmpty(request.Language) && !string.IsNullOrEmpty(request.Genre))
                papers = await publicationRepo.GetMagazinesByLanguage(request.Language);
            else papers = await publicationRepo.GetMagazinesAsync();

            if (papers == null || !papers.Any())
                throw new NotFoundException("Magazine Not found");

            List<MagazineDto> result = papers.Select(m => m.ToMagazineDto()).ToList();

            return result;
        }
    }
}
