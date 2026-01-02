
using EntertainmentApp.Applicatoin.Features.Music.TrackFeatur;
using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Music;
using EntertainmentApp.Domain.Entities.Publication;

namespace EntertainmentApp.Applicatoin.Features.Publication.NewsPaperFeature
{
    public record GetPublicationRefrenceDataQuery : IQuery<PublicationRefrenceDataResponse>;
    public record PublicationRefrenceDataResponse(
    List<GenreDto> Genres,
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
                    genres.Select(g => g.ToGenreDto()).ToList(),
                    LanguageList.Languages,
                    publishers.Select(s => s.ToPublisherDto()).ToList()
                    );
        }
    }
}
