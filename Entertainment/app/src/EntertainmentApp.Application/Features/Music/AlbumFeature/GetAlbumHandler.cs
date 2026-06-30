
using EntertainmentApp.Application.Interfaces;
using EntertainmentApp.Domain.Entities.Music;

namespace EntertainmentApp.Application.Features.Music.AlbumFeature
{
    public record GetAlbumQuery(string Language, string Genre) : IQuery<List<AlbumDto>>;
    public class GetAlbumHandler(IMusicRepository musicRepo) : IQueryHandler<GetAlbumQuery, List<AlbumDto>>
    {
        public async Task<List<AlbumDto>> Handle(GetAlbumQuery request, CancellationToken cancellationToken)
        {
            List<Album> albums = null;
            if (!string.IsNullOrEmpty(request.Language) && string.IsNullOrEmpty(request.Genre))
                albums = await musicRepo.GetAlbumByLanguage(request.Language);
            else if (!string.IsNullOrEmpty(request.Language) && !string.IsNullOrEmpty(request.Genre))
                albums = await musicRepo.GetAlbumByFilterAsync(request.Language, request.Genre);
            else if (string.IsNullOrEmpty(request.Language) && !string.IsNullOrEmpty(request.Genre))
                albums = await musicRepo.GetAlbumByLanguage(request.Language);
            else albums = await musicRepo.GetAlbumsAsync();

            if (albums == null || !albums.Any())
                throw new NotFoundException("album Not found");

            List<AlbumDto> result = albums.Select(m => m.ToAlbumDto()).ToList();

            return result;
        }
    }
}
