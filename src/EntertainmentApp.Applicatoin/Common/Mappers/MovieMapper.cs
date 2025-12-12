using EntertainmentApp.Applicatoin.Dtos;
using EntertainmentApp.Domain.Entities.Video;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Common.Mappers
{
    public static class MovieMapper
    {
        public static MovieDto ToMoveDto(this Movie movie)
        {
            MovieDto movieDto = new MovieDto
            {
                Id = movie.Id,
                Title = movie.Title,
                Description = movie.Description,
                ImdbRating = movie.ImdbRating,
                PublishedDate = movie.PublishedDate,
                Countries = movie.Countries,
                Language = movie.Languages,
                Genres = movie.Genres.Select(g => g.Title).ToList(),
                Directors = movie.Directors.Select(d => new DirectorDto { Name = d.Name, ImagePath = d.ImagePath }).ToList(),
                Actors = movie.Actors.Select( a => new ActorDto { Name = a.Name, ImagePath = a.ImagePath}).ToList(),
                Media = new MediaDto
                {
                    PosterImageUrl = movie.Media.PosterImageUrl,
                    StreamUrl = movie.Media.StreamUrl,
                }
            };
            return movieDto;
        }
    }
}
