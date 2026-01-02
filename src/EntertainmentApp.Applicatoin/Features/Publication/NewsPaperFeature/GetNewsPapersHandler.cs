
using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Music;
using EntertainmentApp.Domain.Entities.Publication;

namespace EntertainmentApp.Applicatoin.Features.Publication.NewsPaperFeature
{
    public record GetNewsPapersQuery(string Language, string Genre) : IQuery<List<NewsPaperDto>>;
    public class GetNewsPapersHandler(IPublicationRepository publicationRepo) : IQueryHandler<GetNewsPapersQuery, List<NewsPaperDto>>
    {
        public async Task<List<NewsPaperDto>> Handle(GetNewsPapersQuery request, CancellationToken cancellationToken)
        {
            List<NewsPaper> papers = null;
            if (!string.IsNullOrEmpty(request.Language) && string.IsNullOrEmpty(request.Genre))
                papers = await publicationRepo.GetNewsPapersByLanguage(request.Language);
            else if (!string.IsNullOrEmpty(request.Language) && !string.IsNullOrEmpty(request.Genre))
                papers = await publicationRepo.GetNewsPapersByFilterAsync(request.Language, request.Genre);
            else if (string.IsNullOrEmpty(request.Language) && !string.IsNullOrEmpty(request.Genre))
                papers = await publicationRepo.GetNewsPapersByLanguage(request.Language);
            else papers = await publicationRepo.GetNewsPapersAsync();

            if (papers == null || !papers.Any())
                throw new NotFoundException("Movie Not found");

            List<NewsPaperDto> result = papers.Select(m => m.ToNewsPaperDto()).ToList();

            return result;
        }
    }
}
