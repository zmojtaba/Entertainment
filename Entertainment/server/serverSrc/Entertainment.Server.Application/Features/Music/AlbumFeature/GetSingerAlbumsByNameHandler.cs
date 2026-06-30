using Entertainment.Server.Applicatoin.Interfaces;
using Entertainment.Server.Domain.Entities.Music;

namespace Entertainment.Server.Applicatoin.Features.Music.AlbumFeature
{
    public record GetSingerAlbumsByNameQuery(string Singer): IQuery<SingerAlbumsDto>;
    public class GetSingerAlbumsByNameHandler(IMusicRepository musicRepo) : IQueryHandler<GetSingerAlbumsByNameQuery, SingerAlbumsDto>
    {
        public async Task<SingerAlbumsDto> Handle(GetSingerAlbumsByNameQuery request, CancellationToken cancellationToken)
        {
            List<Album> albums = await musicRepo.GetAlbumsBySingerName(request.Singer);
            var result = albums.GroupBy(a => a.Singer)
                .Select(g => new SingerAlbumsDto
                {
                    Singer = g.Key.ToSingerDto(),
                    Albums = g.Select(a => a.ToAlbumDto()).ToList()
                }).FirstOrDefault();
            if (result == null) throw new NotFoundException("Albums for this singer not found");
            return result;
        }
    }
}
