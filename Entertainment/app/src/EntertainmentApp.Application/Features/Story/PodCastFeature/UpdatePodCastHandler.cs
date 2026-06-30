namespace EntertainmentApp.Application.Features.Story.PodCastFeature
{
    public class UpdatePodCastCommand : ICommand<PodCastDto>
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public int AgeGroup { get; set; }
        public string? PosterImageUrl { get; set; } = string.Empty;
        public List<string> Genres { get; set; } = new List<string>();
        public List<string> Speakers { get; set; } = new List<string>();
    }

    public class UpdatePodCastCommandValidator : AbstractValidator<UpdatePodCastCommand>
    {
        public UpdatePodCastCommandValidator()
        {
            RuleFor(x => x.Id).NotNull().WithMessage("Id is required");
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
            RuleFor(x => x.Languages).NotEmpty().WithMessage("At least one language is required.");
            RuleFor(x => x.AgeGroup).GreaterThan(0).WithMessage("Age group cannot be negative.");
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


    public class UpdatePodCastHandler(IStoryRepository storyRepo, IMediaService mediaService) : ICommandHandler<UpdatePodCastCommand, PodCastDto>
    {
        public async Task<PodCastDto> Handle(UpdatePodCastCommand command, CancellationToken cancellationToken)
        {
            PodCast? podCast = await storyRepo.GetPodCastByIdAsync(command.Id);
            if (podCast == null) throw new NotFoundException("PodCast Not found");

            if (!string.IsNullOrEmpty(command.PosterImageUrl))
            {
                string posterImageUrl = await mediaService.MoveStreamToExistenceDirectoryAsync(
                    command.PosterImageUrl,
                    Path.GetDirectoryName(podCast.PosterImageUrl));

                mediaService.DeleteFileAsync(podCast.PosterImageUrl, true);

                podCast.SetPosterImageUrl(posterImageUrl);
            }



            podCast.SetTitle(command.Title);
            podCast.SetDescription(command.Description);
            podCast.SetLanguages(LanguageList.Languages
                .Where(x => command.Languages
                    .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                .ToList());
            podCast.SetAgeGroup(command.AgeGroup);




            podCast.RemoveGenres();
            foreach (string g in command.Genres)
            {
                Genre? genre = await storyRepo.GetGenreAsync(g);
                if (genre == null)
                {
                    genre = await storyRepo.AddGenreAsync(new Genre(g));
                    genre.AddCategory("story");
                }
                podCast.AddGenre(genre);
            }

            // 5. Add directors
            podCast.RemoveSpeaker();
            foreach (var speakerName in command.Speakers)
            {
                var speaker = await storyRepo.GetSpeakerAsync(speakerName);
                if (speaker == null)
                {
                    speaker = new Speaker(speakerName);
                    speaker = await storyRepo.AddSpeakerAsync(speaker);
                }
                podCast.Speakers.Add(speaker);
            }




            await storyRepo.UpdatePodCastAsync(podCast);

            return podCast.ToPodCastDto();

        }
    }
}
