using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Domain.Entities.Music;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Music.AlbumFeature
{


    public record GetSingersAlbumsQuery(string Language, string Genre) : IQuery<List<SingerAlbumsDto>>;
    public class GetSingersAlbumsHandler : IQueryHandler<GetSingersAlbumsQuery, List<SingerAlbumsDto>>
    {
        private readonly IMusicRepository _musicRepo;

        public GetSingersAlbumsHandler(IMusicRepository musicRepo)
        {
            _musicRepo = musicRepo;
        }

        public async Task<List<SingerAlbumsDto>> Handle(GetSingersAlbumsQuery request, CancellationToken cancellationToken)
        {
            List<Album> albums = null;
            if (!string.IsNullOrEmpty(request.Language) && string.IsNullOrEmpty(request.Genre))
                albums = await _musicRepo.GetAlbumByLanguage(request.Language);
            else if (!string.IsNullOrEmpty(request.Language) && !string.IsNullOrEmpty(request.Genre))
                albums = await _musicRepo.GetAlbumByFilterAsync(request.Language, request.Genre);
            else if (string.IsNullOrEmpty(request.Language) && !string.IsNullOrEmpty(request.Genre))
                albums = await _musicRepo.GetAlbumByLanguage(request.Language);
            else albums = await _musicRepo.GetAlbumsAsync();

            if (albums == null || !albums.Any())
                throw new NotFoundException("album Not found");
            var result = albums
                .GroupBy(a => a.Singer)
                .Select(g => new SingerAlbumsDto
                {
                    Singer = g.Key.ToSingerDto(),
                    Albums = g.Select(a => a.ToAlbumDto()).ToList()
                })
                .ToList();
            return result;
        }
    }
}
