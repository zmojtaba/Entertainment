using EntertainmentApp.Applicatoin.Common.Dtos;
using EntertainmentApp.Applicatoin.Common.Mappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Video.GetMovieById
{
    public record GetMovieByIdQuery(Guid Id) : IQuery<MovieDto>;
    public class GetMovieByIdHandler(IMovieRepository movieRepo) : IQueryHandler<GetMovieByIdQuery, MovieDto>
    {
        public async Task<MovieDto> Handle(GetMovieByIdQuery request, CancellationToken cancellationToken)
        {
            Movie movie = await movieRepo.GetMovieByIdAsync(request.Id);
            if (movie == null) throw new NotFoundException("Movie not found");
            return movie.ToMoveDto();
        }
    }
}
