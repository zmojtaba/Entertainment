using MediatR;

namespace EntertainmentApp.Applicatoin.Features.Movies.Command
{
    public class CreateMovieHandler
    {
        public record CreateMovieCommand(string name) : IRequest<string>;
        public class CreateMovieCommandHandler : IRequestHandler<CreateMovieCommand, string>
        {
            public async Task<string> Handle(CreateMovieCommand request, CancellationToken cancellationToken)
            {
                return  "create in handler";
            }
        }
    }
}
