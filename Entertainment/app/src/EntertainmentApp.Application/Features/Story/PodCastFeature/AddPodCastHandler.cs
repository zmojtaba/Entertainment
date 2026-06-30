namespace EntertainmentApp.Application.Features.Story.PodCastFeature
{
    public class AddPodCastCommand : ICommand<PodCastDto>
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public int AgeGroup { get; set; }
        public string PosterImageUrl { get; set; } = string.Empty;
        public List<string> Genres { get; set; } = new List<string>();
        public List<string> Speakers { get; set; } = new List<string>();
    }
    public class AddPodCastCommandValidator : AbstractValidator<AddPodCastCommand>
    {
        public AddPodCastCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
            RuleFor(x => x.Languages).NotEmpty().WithMessage("At least one language is required.");
            RuleFor(x => x.AgeGroup).GreaterThan(0).WithMessage("Age group cannot be negative.");
            RuleFor(x => x.PosterImageUrl).NotEmpty().WithMessage("Poster image URL is required.");
            RuleFor(x => x.Genres)
                .NotNull().WithMessage("Genre is required");
            RuleForEach(x => x.Genres).NotEmpty().WithMessage("Genre can not contains empty string");


            RuleFor(x => x.Speakers)
                .NotNull().WithMessage("Speaker is required");
            RuleForEach(x => x.Speakers).NotEmpty().WithMessage("Speaker can not contains empty string");

            RuleFor(x => x.Languages)
                .NotNull().WithMessage("Language is required");
            RuleForEach(x => x.Languages)
                .NotEmpty().WithMessage("Language can not contains empty string")
                .Must(l => LanguageList.Languages.Contains(l, StringComparer.OrdinalIgnoreCase))
                .WithMessage("Language {PropertyValue} is not supported.");
        }
    }


    public class AddPodCastHandler : ICommandHandler<AddPodCastCommand, PodCastDto>
    {
        private readonly IStoryRepository _storyRepository;
        private readonly IMediaService _mediaService;
        public AddPodCastHandler(IStoryRepository storyRepository, IMediaService mediaService)
        {
            _storyRepository = storyRepository;
            _mediaService = mediaService;

        }
        public async Task<PodCastDto> Handle(AddPodCastCommand command, CancellationToken cancellationToken)
        {
            if (!File.Exists(command.PosterImageUrl))
                throw new BadRequestException("Poster image file was not stored. try again");
            string posterImageUrl = null;
            try
            {
                posterImageUrl = await _mediaService.MovePosterImage(command.PosterImageUrl, command.Title, "story", "podcast");
            }
            catch (Exception ex)
            {
                await _mediaService.DeleteFileAsync(command.PosterImageUrl);
                throw new InternalServerException(ex.Message);
            }

            // Create PodCast entity
            PodCast podCast = new PodCast(
                command.Title,
                command.Description,
                LanguageList.Languages
                    .Where(x => command.Languages
                        .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                    .ToList(),
                command.AgeGroup,
                posterImageUrl
            );
            // Handle Genres
            foreach (string genreTitle in command.Genres)
            {
                Genre genre = await _storyRepository.GetGenreAsync(genreTitle);
                if (genre == null)
                {
                    genre = new Genre(genreTitle);
                    genre = await _storyRepository.AddGenreAsync(genre);
                }
                podCast.Genres.Add(genre);
            }
            // Handle Speakers
            foreach (var speakerName in command.Speakers)
            {
                var speaker = await _storyRepository.GetSpeakerAsync(speakerName);
                if (speaker == null)
                {
                    speaker = new Speaker(speakerName);
                    speaker = await _storyRepository.AddSpeakerAsync(speaker);
                }
                podCast.Speakers.Add(speaker);
            }
            // Save PodCast
            podCast = await _storyRepository.AddPodCastAsync(podCast);
            // Map to DTO
            return podCast.ToPodCastDto();
        }
    }

}

