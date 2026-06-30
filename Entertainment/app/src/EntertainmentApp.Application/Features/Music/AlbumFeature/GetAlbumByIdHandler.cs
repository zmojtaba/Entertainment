
using EntertainmentApp.Application.Interfaces;
using EntertainmentApp.Domain.Entities.Music;

namespace EntertainmentApp.Application.Features.Music.AlbumFeature
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
