
using Entertainment.Server.Applicatoin.Features.Publication.NewsPaperFeature;
using Entertainment.Server.Applicatoin.Interfaces;
using Entertainment.Server.Domain.Entities.Publication;
using System.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Entertainment.Server.Applicatoin.Features.Publication.MagazineFeature
{
    public class UpdateMagazineCommand : ICommand<MagazineDto>
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public long PublishedDate { get; set; }
        public List<string> Languages { get; set; } = new List<string>();
        public string? TempPosterImageUrl { get; set; } = null;
        public List<string> Genres { get; set; } = new List<string>();
        public string Publisher { get; set; } = string.Empty;
    }

    public class UpdateMagazineCommandValidator : AbstractValidator<UpdateMagazineCommand>
    {
        public UpdateMagazineCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.Publisher).NotEmpty().WithMessage("Publisher Name is required");
            RuleFor(x => x.PublishedDate).NotNull().GreaterThan(0).WithMessage("Published Date is required and must be valid");
            RuleFor(x => x.Genres)
            .NotNull().WithMessage("Genre is required");
            RuleForEach(x => x.Genres).NotEmpty().WithMessage("Genre can not contains empty string");


            RuleFor(x => x.Languages)
                .NotNull().WithMessage("Language is required");
            RuleForEach(x => x.Languages)
                .NotEmpty().WithMessage("Language can not contains empty string")
                .Must(l => LanguageList.Languages.Contains(l, StringComparer.OrdinalIgnoreCase))
                .WithMessage("Language {PropertyValue} is not supported.");
        }
    }
    public class UpdateMagazineHandler : ICommandHandler<UpdateMagazineCommand, MagazineDto>
    {
        private readonly IPublicationRepository _publicationRepository;
        private readonly IMediaService _mediaService;
        private readonly IConfiguration _config;
        public UpdateMagazineHandler(IPublicationRepository publicationRepository, IMediaService mediaService, IConfiguration config)
        {
            _publicationRepository = publicationRepository;
            _mediaService = mediaService;
            _config = config;
        }
        public async Task<MagazineDto> Handle(UpdateMagazineCommand command, CancellationToken cancellationToken)
        {
            Magazine? paper = await _publicationRepository.GetMagazineByIdAsync(command.Id);
            if (paper == null) throw new NotFoundException("Magazine not found");
            paper.SetTitle(command.Title);
            paper.SetLanguages(LanguageList.Languages
                .Where(x => command.Languages
                    .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                .ToList());
            paper.SetPublishedDate(command.PublishedDate);
            if (!string.IsNullOrWhiteSpace(command.TempPosterImageUrl))
            {
                string posterImageUrl = await _mediaService.MoveStreamToExistenceDirectoryAsync(
                    command.TempPosterImageUrl,
                    Path.GetDirectoryName(paper.PosterImageUrl));

                await _mediaService.DeleteFileAsync(paper.PosterImageUrl, true);
                paper.SetPosterImageUrl(posterImageUrl);
            }


            paper.RemoveGenres();
            foreach (string g in command.Genres)
            {
                Genre? genre = await _publicationRepository.GetGenreAsync(g);
                if (genre == null)
                {
                    genre = await _publicationRepository.AddGenreAsync(new Genre(g));
                    genre.AddCategory("publication");
                }
                paper.AddGenre(genre);
            }

            if (!command.Publisher.Equals(paper.Publisher?.Name, StringComparison.OrdinalIgnoreCase))
            {
                Publisher? publisher = await _publicationRepository.GetPublisherAsync(command.Publisher);
                if (publisher == null)
                {
                    publisher = await _publicationRepository.AddPublisherAsync(new Publisher(command.Publisher));
                }
                string newPosterPath = await _mediaService.MovePosterImage(
                        Path.Combine(_config["BaseStoragePath"], paper.PosterImageUrl),
                        command.Publisher, "publication", "magazine");
                string newStreamPath = await _mediaService.MoveStreamToExistenceDirectoryAsync(
                    Path.Combine(_config["BaseStoragePath"], paper.StreamUrl),
                    Path.GetDirectoryName(newPosterPath));

                paper.SetStreamUrl(newStreamPath);
                paper.SetPosterImageUrl(newPosterPath);

                paper.SetPublisher(publisher);
            }


            await _publicationRepository.UpdateMagazineAsync(paper);
            return paper.ToMagazineDto();
        }
    }
}
