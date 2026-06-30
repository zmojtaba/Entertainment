namespace Entertainment.Server.Applicatoin.Features.Publication.NewsPaperFeature
{
    public class AddNewsPaperCommand : ICommand<NewsPaperDto>
    {

        public string Title { get; set; } = string.Empty;
        public List<string> Genres { get; set; }
        public List<string> Languages { get; set; } = new List<string>();
        public long PublishedDate { get; set; }
        public string Publisher { get; set; }
        public string TempStreamUrl { get; set; } = string.Empty;
        public string StreamFileName { get; set; } = string.Empty;
        public string TempPosterImageUrl { get; set; } = string.Empty;
        public string PosterImageFileName { get; set; } = string.Empty;
    }


    public class AddNewsPaperCommandValidator : AbstractValidator<AddNewsPaperCommand>
    {
        public AddNewsPaperCommandValidator()
        {

            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.TempStreamUrl).NotEmpty().WithMessage("Media is required");
            RuleFor(x => x.TempPosterImageUrl).NotEmpty().WithMessage("Poster image is required");
            RuleFor(x => x.PublishedDate).NotNull().WithMessage("Published Date is required").GreaterThan(0).WithMessage("Publishe Date must be grather than zero");

            RuleFor(x => x.Genres)
            .NotNull().WithMessage("Genre is required");
            RuleForEach(x => x.Genres).NotEmpty().WithMessage("Genre can not contains empty string");


            RuleFor(x => x.Publisher)
                .NotEmpty().WithMessage("Publisher is required");

            RuleFor(x => x.Languages)
                .NotNull().WithMessage("Language is required");
            RuleForEach(x => x.Languages)
                .NotEmpty().WithMessage("Language can not contains empty string")
                .Must(l => LanguageList.Languages.Contains(l, StringComparer.OrdinalIgnoreCase))
                .WithMessage("Language {PropertyValue} is not supported.");

            RuleFor(x => x.StreamFileName)
                .NotEmpty().WithMessage("Media file must be valid.")
                .Must(x => ValidExtensionList.BookExtension.Contains(Path.GetExtension(x), StringComparer.OrdinalIgnoreCase))
                .WithMessage($"Invalid ebook file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.BookExtension)}");
            RuleFor(x => x.PosterImageFileName).NotEmpty().WithMessage("Poster Image must be valid.")
                .Must(x => ValidExtensionList.ImageExtension.Contains(Path.GetExtension(x), StringComparer.OrdinalIgnoreCase))
                .WithMessage($"Invalid image file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.ImageExtension)}");

        }
    }



    public class AddNewsPaperHandler : ICommandHandler<AddNewsPaperCommand, NewsPaperDto>
    {
        private readonly IMediaService _mediaService;
        private readonly IPublicationRepository _publicationRepo;
        public AddNewsPaperHandler(IMediaService mediaService, IPublicationRepository publicationRepo)
        {
            _mediaService = mediaService;
            _publicationRepo = publicationRepo;
        }



        public async Task<NewsPaperDto> Handle(AddNewsPaperCommand command, CancellationToken cancellationToken)
        {
            string posterImagePath = await _mediaService.MovePosterImage(command.TempPosterImageUrl, command.Publisher, "publication", "newspaper");
            string streamPath = await _mediaService.MoveStreamToExistenceDirectoryAsync(command.TempStreamUrl,
                Path.GetDirectoryName(posterImagePath));
            NewsPaper paper = new NewsPaper(
                command.Title,
                LanguageList.Languages
                    .Where(x => command.Languages
                        .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                    .ToList(),
                command.PublishedDate,
                streamPath,
                posterImagePath
                );

            foreach (string g in command.Genres)
            {
                Genre? genre = await _publicationRepo.GetGenreAsync(g);
                if (genre == null)
                {
                    genre = await _publicationRepo.AddGenreAsync(new Genre(g));
                    genre.AddCategory("publication");
                }
                paper.AddGenre(genre);
            }

            Publisher? publisher = await _publicationRepo.GetPublisherAsync(command.Publisher);
            if (publisher == null)
            {
                publisher = await _publicationRepo.AddPublisherAsync(new Publisher(command.Publisher));
            }
            paper.SetPublisher(publisher);

            try
            {
                await _publicationRepo.AddNewsPaperAsync(paper);
            }
            catch (Exception ex)
            {
                await _mediaService.DeleteFileAsync(paper.StreamUrl, true);
                await _mediaService.DeleteFileAsync(paper.PosterImageUrl, true);
                if (ex.InnerException.Message.IndexOf("duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase) >= 0)
                    throw new BadRequestException(ex.Message);
                throw;

            }

            return paper.ToNewsPaperDto();
        }
    }
}
