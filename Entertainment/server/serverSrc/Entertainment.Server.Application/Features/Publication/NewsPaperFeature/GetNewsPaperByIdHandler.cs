
using Entertainment.Server.Applicatoin.Interfaces;
using Entertainment.Server.Domain.Entities.Publication;

namespace Entertainment.Server.Applicatoin.Features.Publication.NewsPaperFeature
{
    public record GetNewsPaperByIdQuery(Guid NewsPaperId) : IQuery<NewsPaperDto>;
    public class GetNewsPaperByIdHandler(IPublicationRepository publicationRepo) : IQueryHandler<GetNewsPaperByIdQuery, NewsPaperDto>
    {
        public async Task<NewsPaperDto> Handle(GetNewsPaperByIdQuery request, CancellationToken cancellationToken)
        {
            NewsPaper paper = await publicationRepo.GetNewsPaperByIdAsync(request.NewsPaperId);
            if (paper == null)
                throw new NotFoundException("NewsPaper Not found");
            return paper.ToNewsPaperDto();

        }
    }
}
