using EntertainmentApp.Applicatoin.Interfaces.CoruRepository;
using EntertainmentApp.Domain.Entities;

namespace EntertainmentApp.Applicatoin.Features.CoruFeature
{
    public class CreateCoruHandler
    {
        public record CreateCoruCommand(
            string Title,
            string TempStreamUrl,
            string City,
            string Country
            ) : ICommand<Coru>;

        public class CreateCoruCommandVlidator : AbstractValidator<CreateCoruCommand>
        {
            public CreateCoruCommandVlidator()
            {
                RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
                RuleFor(x => x.TempStreamUrl).NotEmpty().WithMessage("Media is required");
                RuleFor(x => x.City).NotEmpty().WithMessage("City is required");
                RuleFor(x => x.Country).NotEmpty().WithMessage("Country is required");
            }
        }

        public class CreateCoruCommandHandler(ICoruRepository coruRepo, IMediaService mediaService) : ICommandHandler<CreateCoruCommand, Coru>
        {
            public async Task<Coru> Handle(CreateCoruCommand command, CancellationToken cancellationToken)
            {
                string streamPath = await mediaService.MoveStreamToExistenceDirectoryAsync(
                    command.TempStreamUrl, "coru"
                    );
                Coru coru = new Coru(
                    title: command.Title,
                    country:
                     CountryList.Countries
                    .Where(x => x.ToLower() ==  command.Country.ToLower()).First(),
                    city: command.City,
                    streamUrl: streamPath
                    );
                await coruRepo.AddCoruAsync(coru);
                return coru;
            }
        }


    }
}
