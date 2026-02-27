using EntertainmentApp.Applicatoin.Interfaces;

namespace EntertainmentApp.Applicatoin.Features
{
    public record CreateGenreCommand(List<string> Genres, string Category) : ICommand<CreateGenreResponse>;
    public record CreateGenreResponse(List<GenreDto> AddedGenres, List<GenreDto> ExistedGenres);
    public class CreateGenreCommandValidator : AbstractValidator<CreateGenreCommand>
    {
        public CreateGenreCommandValidator()
        {
            RuleFor(x => x.Genres)
                .NotNull().WithMessage("Genre is required");

            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required")
                .Must(x => x.Equals("video", StringComparison.OrdinalIgnoreCase) || 
                x.Equals("music", StringComparison.OrdinalIgnoreCase) ||
                x.Equals("story", StringComparison.OrdinalIgnoreCase) ||
                x.Equals("publication", StringComparison.OrdinalIgnoreCase)
                ).WithMessage("Category is not valid.");
            RuleForEach(x => x.Genres).NotEmpty().WithMessage("Genre can not contains empty string");
        }
    }
    public class CreateGenreHandler : ICommandHandler<CreateGenreCommand, CreateGenreResponse>
    {
        private readonly IHomeRepository _homeRepository;

        public CreateGenreHandler(IHomeRepository repo)
        {
            _homeRepository = repo;
        }

        public async Task<CreateGenreResponse> Handle(CreateGenreCommand command, CancellationToken cancellationToken)
        {
            List<GenreDto> addedGenreDtos = new List<GenreDto>();
            List<GenreDto> existedGenreDtos = new List<GenreDto>();
            foreach (string g in command.Genres)
            {
                Genre? genre = await _homeRepository.GetGenreAsync(g);
                if (genre == null)
                {
                    genre = new Genre(g);
                    genre.AddCategory(command.Category);
                    genre = await _homeRepository.AddGenreAsync(genre);
                    addedGenreDtos.Add(genre.ToGenreDto());
                    continue;

                }
                genre.AddCategory(command.Category);
                existedGenreDtos.Add(genre.ToGenreDto());
            }
            if (!addedGenreDtos.Any()) throw new BadRequestException("All genres already exist");
            return new CreateGenreResponse(addedGenreDtos, existedGenreDtos);
        }
    }
}
