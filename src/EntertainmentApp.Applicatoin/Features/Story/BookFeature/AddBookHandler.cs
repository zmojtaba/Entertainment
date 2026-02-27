using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using EntertainmentApp.Domain.Entities.Story;
using EntertainmentApp.Domain.Entities.Video;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace EntertainmentApp.Applicatoin.Features.Story.BookFeature
{
    public class AddBookHandler
    {
        public class AddBookCommand : ICommand<BookDto>
        {
            public string Title { get; set; }
            public string Description { get; set; } = string.Empty;
            public List<string> Genres { get; set; }
            public List<string> Languages { get; set; }
            public int AgeGroup { get; set; }
            public List<string> Writers { get; set; } = new List<string>();
            public decimal Rating { get; set; }
            public int PublishedDate { get; set; }
            public string TempPosterImageUrl { get; set; } = string.Empty;
            public string PosterImageFileName { get; set; } = string.Empty;
            public string TempStreamUrl { get; set; } = string.Empty;
            public string StreamFileName { get; set; } = string.Empty;
        }

        public class AddBookCommandValidator : AbstractValidator<AddBookCommand>
        {
            public AddBookCommandValidator()
            {

                RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
                RuleFor(x => x.TempStreamUrl).NotEmpty().WithMessage("Media is required");
                RuleFor(x => x.TempPosterImageUrl).NotEmpty().WithMessage("Poster image is required");
                RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required");
                RuleFor(x => x.PublishedDate).NotNull().WithMessage("Published Date is required").GreaterThan(0).WithMessage("Publishe Date must be grather than zero");
                RuleFor(x => x.AgeGroup).NotNull().WithMessage("Age group is required").GreaterThan(0).WithMessage("Age group can not be negetive");
                RuleFor(x => x.Rating).LessThanOrEqualTo(10).GreaterThan(0).WithMessage("IMDB rating must be between Zero and Ten");

                RuleFor(x => x.Genres)
                .NotNull().WithMessage("Genre is required");
                RuleForEach(x => x.Genres).NotEmpty().WithMessage("Genre can not contains empty string");


                RuleFor(x => x.Writers)
                    .NotNull().WithMessage("Writer is required");
                RuleForEach(x => x.Writers).NotEmpty().WithMessage("Writers can not contains empty string");

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


        public class AddBookCommandHandler(IMediaService mediaService, IStoryRepository storyRepo) : ICommandHandler<AddBookCommand, BookDto>
        {
            public async Task<BookDto> Handle(AddBookCommand command, CancellationToken cancellationToken)
            {
                string posterImagePath = await mediaService.MovePosterImage(command.TempPosterImageUrl, command.Title, "story", "book");
                string streamPath = await mediaService.MoveStreamToExistenceDirectoryAsync(command.TempStreamUrl,
                    Path.GetDirectoryName(posterImagePath));
                
                Book book = new Book(
                    command.Title,
                    command.Description,
                    LanguageList.Languages
                        .Where(x => command.Languages
                            .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                        .ToList(),
                    command.AgeGroup,
                    command.Rating,
                    command.PublishedDate,
                    streamPath,
                    posterImagePath
                    );

                foreach (string g in command.Genres)
                {
                    Genre? genre = await storyRepo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = await storyRepo.AddGenreAsync(new Genre(g));
                        genre.AddCategory("story");
                    }
                    book.AddGenre(genre);
                }

                foreach(string w in command.Writers)
                {
                    Writer? writer = await storyRepo.GetWriterAsync(w);
                    if (writer == null)
                    {
                        writer = await storyRepo.AddWriterAsync(new Writer(w));
                    }
                    book.AddWriter(writer);

                }

                try
                {
                    await storyRepo.AddBookAsync(book);
                }
                catch (DbUpdateException ex)
                {
                    await mediaService.DeleteFileAsync(book.StreamUrl, true);
                    await mediaService.DeleteFileAsync(book.PosterImageUrl, true);
                    await mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(book.StreamUrl), true);
                    if (ex.InnerException.Message.IndexOf("duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase) >= 0)
                        throw new BadRequestException("Book with this Title and Pusblish Date is already exists");
                    throw;

                }

                return book.ToBookDto();
            }
        }
    }
}
