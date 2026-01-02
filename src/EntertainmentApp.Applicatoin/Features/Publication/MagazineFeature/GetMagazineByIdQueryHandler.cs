using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Publication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Publication.MagazineFeature
{
    public record GetMagazineByIdQuery(Guid MagazineId) : IQuery<MagazineDto>;
    public class GetMagazineByIdQueryHandler(IPublicationRepository publicationRepo) : IQueryHandler<GetMagazineByIdQuery, MagazineDto>
    {
        public async Task<MagazineDto> Handle(GetMagazineByIdQuery request, CancellationToken cancellationToken)
        {
            Magazine paper = await publicationRepo.GetMagazineByIdAsync(request.MagazineId);
            if (paper == null)
                throw new NotFoundException("Magazine Not found");
            return paper.ToMagazineDto();
        }
    }
}
