
using Entertainment.Server.Applicatoin.Interfaces;
using Entertainment.Server.Domain.Entities.Music;

namespace Entertainment.Server.Applicatoin.Features.Music.AlbumFeature
{
    public record GetAlbumByIdQuery(Guid Id) : IQuery<AlbumDto>;
    public class GetAlbumByIdHandler(IMusicRepository musicRepo) : IQueryHandler<GetAlbumByIdQuery, AlbumDto>
    {
        public async Task<AlbumDto> Handle(GetAlbumByIdQuery request, CancellationToken cancellationToken)
        {
            Album album = await musicRepo.GetAlbumByIdAsync(request.Id);
            if (album == null)
                throw new NotFoundException("Album Not found");
            return album.ToAlbumDto();
        }
    }
}
