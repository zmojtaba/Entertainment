using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using EntertainmentApp.Domain.Entities.Story;
using EntertainmentApp.Domain.Entities.Video;
using System.Linq;
using static EntertainmentApp.Applicatoin.Features.Story.BookFeature.AddBookHandler;

namespace EntertainmentApp.Applicatoin.Features.Story.BookFeature
{
    public class UpdateBookHandler
    {
        public class UpdateBookCommand : ICommand<BookDto>
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public List<string> Languages { get; set; } = new List<string>();
            public int AgeGroup { get; set; }
            public decimal Rating { get; set; }
            public int PublishedDate { get; set; }
            public List<string> Genres { get; set; } = new();
            public List<string> Writers { get; set; } = new();
        }

        public class AddBookCommandValidator : AbstractValidator<UpdateBookCommand>
        {
            public AddBookCommandValidator()
            {

                RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required");
                RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
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


            }
        }

        public class UpdateBookCommandHandler(IStoryRepository storyRepo, IMediaService mediaService) : ICommandHandler<UpdateBookCommand, BookDto>
        {
            public async Task<BookDto> Handle(UpdateBookCommand command, CancellationToken cancellationToken)
            {
                Book book = await storyRepo.GetBookByIdAsync(command.Id);
                if (book == null) throw new NotFoundException("Book Not found");

                if (!book.Title.Equals(command.Title, StringComparison.OrdinalIgnoreCase))
                {
                    string newMediaDirectory = await mediaService.MoveMediaDirectory(Path.GetDirectoryName(book.StreamUrl), command.Title, "video", "movie", true);
                    book.SetStreamUrl(Path.Combine(
                        newMediaDirectory,
                        Path.GetFileName(book.StreamUrl)
                        ));
                    book.SetPosterImageUrl(Path.Combine(
                        newMediaDirectory,
                        Path.GetFileName(book.PosterImageUrl)
                        ));
                    Console.WriteLine(newMediaDirectory);

                }



                book.SetTitle(command.Title);
                book.SetDescription(command.Description);
                book.SetLanguages(LanguageList.Languages
                    .Where(x => command.Languages
                        .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                    .ToList());
                book.SetAgeGroup(command.AgeGroup);
                book.SetRating(command.Rating);
                book.SetPublishedDate(command.PublishedDate);



                book.RemoveGenres();
                foreach (string g in command.Genres)
                {
                    Genre? genre = await storyRepo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = await storyRepo.AddGenreAsync(new Genre(g));

                    }
                    book.AddGenre(genre);
                }

                // 5. Add directors
                book.RemoveWriter();
                foreach (string d in command.Writers)
                {
                    Writer? writer = await storyRepo.GetWriterAsync(d);
                    if (writer == null) writer = await storyRepo.AddWriterAsync(new Writer(d));
                    book.AddWriter(writer);
                }


                

                await storyRepo.UpdateBookAsync(book);

                return book.ToBookDto();

            }
        }
    }
}
