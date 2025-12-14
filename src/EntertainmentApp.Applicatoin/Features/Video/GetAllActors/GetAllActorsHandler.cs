
namespace EntertainmentApp.Applicatoin.Features.Video.GetActor
{
    public record GetAllActorsQuery() :  IQuery<List<ActorDto>>;

    public class GetAllActorsHandler(IMovieRepository movieRepo) : IQueryHandler<GetAllActorsQuery, List<ActorDto>>
    {
        public async Task<List<ActorDto>> Handle(GetAllActorsQuery request, CancellationToken cancellationToken)
        {
            List<Actor> actors = await movieRepo.GetAllActorsAsync();
            if (!actors.Any()) throw new NotFoundException("Actor not found");
            return actors.Select(x => x.ToActorDto()).ToList();
        }
    }
}
