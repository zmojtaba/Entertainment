using EntertainmentApp.Applicatoin.Common.Dtos;
using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Music;

namespace EntertainmentApp.Applicatoin.Features.Music.TrackFeatur
{
    public record GetMusicRefrenceDataQuery : IQuery<MusicRefrenceDataResponse>;
    public record MusicRefrenceDataResponse(
        List<GenreDto>? Genres,
        List<string>? Languages,
        List<SingerDto>? Singers
        );
    public class GetMusicRefrenceDataHandler(IMusicRepository musicRepo) : IQueryHandler<GetMusicRefrenceDataQuery, MusicRefrenceDataResponse>
    {
        public async Task<MusicRefrenceDataResponse> Handle(GetMusicRefrenceDataQuery request, CancellationToken cancellationToken)
        {
            List<Genre> genres = await musicRepo.GetMusicGenresAsync();
            List<Singer> singres = await musicRepo.GetAllSingersAsync();
            return new MusicRefrenceDataResponse(
                    genres.Select(g => g.ToGenreDto()).ToList(),
                    LanguageList.Languages,
                    singres.Select(s => s.ToSingerDto()).ToList()
                    );

        }
    }
}
