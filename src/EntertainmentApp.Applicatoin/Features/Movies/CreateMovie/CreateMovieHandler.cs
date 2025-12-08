using BuildingBlocks.CQRS;

namespace EntertainmentApp.Applicatoin.Features.Movies.Command
{
    public class CreateMovieHandler
    {
        public class CreateMovieCommand() : ICommand<string>
        {
            public string Title { get;  set; }
            public long PublishedDate { get;  set; }
            public string Genre { get;  set; }
            public string Description { get;  set; }
            public string Language { get;  set; }
            public int AgeGroup { get;  set; }
            public string Director { get;  set; }
            public List<string> ImageUrls { get;  set; }
            public string MoviePath { get;  set; }
            public decimal IMDBPoint { get;  set; }
        }
        public class CreateMovieCommandVlidator : AbstractValidator<CreateMovieCommand>
        {
            public CreateMovieCommandVlidator()
            {
                RuleFor(x => x.Title)
                    .NotEmpty().WithMessage("Title can not be empty.")
                    .MaximumLength(100).WithMessage("Title can not exceed 100 characters.");
                RuleFor(x => x.PublishedDate).NotEmpty().WithMessage("Publishe date can not be empty")
                    .GreaterThan(0).WithMessage("Publish Date can not be negetive.");
            }
        }
        public class CreateMovieCommandHandler : IRequestHandler<CreateMovieCommand, string>
        {
            public async Task<string> Handle(CreateMovieCommand request, CancellationToken cancellationToken)
            {
                return  "create in handler";
            }
        }
    }
}
