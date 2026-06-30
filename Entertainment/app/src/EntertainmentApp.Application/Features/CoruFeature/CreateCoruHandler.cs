

namespace EntertainmentApp.Application.Features.CoruFeature
{
    public record CreateCoruCommand(
        string Title,
        string TempStreamUrl,
        string City,
        string Country
        ) : ICommand<CoruDto>;

    public class CreateCoruCommandVlidator : AbstractValidator<CreateCoruCommand>
    {
        public CreateCoruCommandVlidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.TempStreamUrl).NotEmpty().WithMessage("Media is required");
            RuleFor(x => x.City).NotEmpty().WithMessage("City is required");
            RuleFor(x => x.Country)
                .NotEmpty().WithMessage("Country is required")
                .Must(c => CountryList.Countries.Contains(c, StringComparer.OrdinalIgnoreCase)).WithMessage("Country is not valid");
        }
    }
    public class CreateCoruHandler(ICoruRepository coruRepo, IMediaService mediaService) : ICommandHandler<CreateCoruCommand, CoruDto>
    {
        public async Task<CoruDto> Handle(CreateCoruCommand command, CancellationToken cancellationToken)
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
            return coru.ToCoruDto();
        }
    }
}
