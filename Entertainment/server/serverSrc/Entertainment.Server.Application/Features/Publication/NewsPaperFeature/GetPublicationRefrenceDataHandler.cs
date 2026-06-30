
using Entertainment.Server.Applicatoin.Features.Music.TrackFeatur;
using Entertainment.Server.Applicatoin.Interfaces;
using Entertainment.Server.Domain.Entities.Music;
using Entertainment.Server.Domain.Entities.Publication;

namespace Entertainment.Server.Applicatoin.Features.Publication.NewsPaperFeature
{
    public record GetPublicationRefrenceDataQuery : IQuery<PublicationRefrenceDataResponse>;
    public record PublicationRefrenceDataResponse(
    List<string> Genres,
    List<string> Languages,
    List<PublisherDto> Publishers
    );
    public class GetPublicationRefrenceDataHandler(IPublicationRepository publicationRepo) : IQueryHandler<GetPublicationRefrenceDataQuery, PublicationRefrenceDataResponse>
    {
        public async Task<PublicationRefrenceDataResponse> Handle(GetPublicationRefrenceDataQuery request, CancellationToken cancellationToken)
        {
            List<Genre> genres = await publicationRepo.GetPublicationGenresAsync();
            List<Publisher> publishers = await publicationRepo.GetAllPublishersAsync();
            return new PublicationRefrenceDataResponse(
                    genres.Select(g => g.Title).ToList(),
                    LanguageList.Languages,
                    publishers.Select(s => s.ToPublisherDto()).ToList()
                    );
        }
    }
}
