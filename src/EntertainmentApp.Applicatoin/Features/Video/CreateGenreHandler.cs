
namespace EntertainmentApp.Applicatoin.Features.Video
{
    public record CreateGenreCommand(List<string> Genres) : ICommand<CreateGenreResponse>;
    public record CreateGenreResponse(List<GenreDto> AddedGenres, List<GenreDto> ExistedGenres);
    public class CreateGenreCommandValidator : AbstractValidator<CreateGenreCommand>
    {
        public CreateGenreCommandValidator()
        {
            RuleFor(x => x.Genres)
                .NotNull().WithMessage("Genre is required");
            RuleForEach(x => x.Genres).NotEmpty().WithMessage("Genre can not contains empty string");
        }
    }
    public class CreateGenreHandler : ICommandHandler<CreateGenreCommand, CreateGenreResponse>
    {
        private readonly IMovieRepository _movieRepository;

        public CreateGenreHandler(IMovieRepository movieRepository)
        {
            _movieRepository = movieRepository;
        }

        public async Task<CreateGenreResponse> Handle(CreateGenreCommand command, CancellationToken cancellationToken)
        {
            List<GenreDto> addedGenreDtos = new List<GenreDto>();
            List<GenreDto> existedGenreDtos = new List<GenreDto>();
            foreach (string g in command.Genres)
            {
                Genre? genre = await _movieRepository.GetGenreAsync(g);
                if (genre == null)
                {
                    genre = await _movieRepository.AddGenreAsync(new Genre(g));
                    addedGenreDtos.Add(genre.ToGenreDto());
                    continue;

                }
                existedGenreDtos.Add(genre.ToGenreDto());
            }
            if (!addedGenreDtos.Any()) throw new BadRequestException("All genres already exist");
            return new CreateGenreResponse(addedGenreDtos, existedGenreDtos);
        }
    }
}
