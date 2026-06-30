using Entertainment.Server.Applicatoin.Common.Dtos;

namespace Entertainment.Server.Applicatoin.Common.Mappers
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
                Languages = movie.Languages,
                AgeGroup = movie.AgeGroup,
                Genres = movie.Genres.Select(g => g.Title).ToList(),
                Directors = movie.Directors.Select(d => new DirectorDto { Name = d.Name, ImagePath = d.ImagePath }).ToList(),
                Actors = movie.Actors.Select( a => new ActorDto { Name = a.Name, ImagePath = a.ImagePath}).ToList(),
                PosterImageUrl = movie.PosterImageUrl,
                StreamUrl = movie.StreamUrl,
                SubtitleUrl = movie.SubtitleUrl

            };
            return movieDto;
        }

        public static ActorDto ToActorDto(this Actor actor)
        {
            return new ActorDto
            {
                Name = actor.Name,
                ImagePath = actor.ImagePath,
            };
        }

        public static GenreDto ToGenreDto(this Genre genre)
        {
            return new GenreDto
            {
                Title = genre.Title,
            };
        }

        public static DirectorDto ToDirectorDto(this Director director)
        {
            return new DirectorDto
            {
                Name = director.Name,
            };
        }
    }
}
