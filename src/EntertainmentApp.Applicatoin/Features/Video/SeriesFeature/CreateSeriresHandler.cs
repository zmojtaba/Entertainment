
namespace EntertainmentApp.Applicatoin.Features.Video.SeriesFeature
{



    public class CreateSeriesCommandValidator : AbstractValidator<CreateSeriesCommand>
    {
        public CreateSeriesCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.PosterImageUrl).NotEmpty().WithMessage("Poster image is required");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required");
            RuleFor(x => x.PublishedDate).NotNull().WithMessage("Published Date is required").GreaterThan(1200).WithMessage("Publishe Date must be grather than 1200");
            RuleFor(x => x.AgeGroup).NotNull().WithMessage("Age group is required").GreaterThan(0).WithMessage("Age Group must be grather than Zero");
            RuleFor(x => x.ImdbRating).LessThanOrEqualTo(10).GreaterThan(0).WithMessage("IMDB rating must be between Zero and Ten");


            RuleFor(x => x.Genres)
                            .NotNull().WithMessage("Genre is required");
            RuleForEach(x => x.Genres).NotEmpty().WithMessage("Genre can not contains empty string");


            RuleFor(x => x.Actors)
                .NotNull().WithMessage("Actor is required");
            RuleForEach(x => x.Actors).NotEmpty().WithMessage("Actor can not contains empty string");


            RuleFor(x => x.Directors)
                .NotNull().WithMessage("Director is required");
            RuleForEach(x => x.Directors).NotEmpty().WithMessage("Director can not contains empty string");



            RuleFor(x => x.Languages)
                .NotNull().WithMessage("Language is required");
            RuleForEach(x => x.Languages)
                .NotEmpty().WithMessage("Language can not contains empty string")
                .Must(l => LanguageList.Languages.Contains(l, StringComparer.OrdinalIgnoreCase))
                .WithMessage("Language {PropertyValue} is not supported.");


            RuleFor(x => x.Countries)
                .NotNull().NotEmpty().WithMessage("Country is required");
            RuleForEach(x => x.Countries)
                .NotEmpty().WithMessage("Country can not contains empty string")
                .Must(c => CountryList.Countries.Contains(c, StringComparer.OrdinalIgnoreCase))
                .WithMessage("Country {PropertyValue} is not valid.");

        }
    }

    public class CreateSeriesCommand : ICommand<SeriesDto>
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string> Languages { get; set; } = new();
        public List<string> Countries { get; set; } = new();
        public int AgeGroup { get; set; }
        public decimal ImdbRating { get; set; }
        public int PublishedDate { get; set; }
        public string PosterImageUrl { get; set; }


        public List<string> Genres { get; set; } = new();
        public List<string> Directors { get; set; } = new();
        public List<string> Actors { get; set; } = new();
    };
    
    
    public class CreateSeriresHandler(
        IMovieRepository movieRepo, 
        ISeriesRepository seriesRepo,
        IMediaService mediaService
        ) : ICommandHandler<CreateSeriesCommand, SeriesDto>
    {
        
        public async Task<SeriesDto> Handle(CreateSeriesCommand command, CancellationToken cancellationToken)
        {
            if (!File.Exists(command.PosterImageUrl))
                throw new BadRequestException("Poster image file was not stored. try again");
            string posterImageUrl = null;
            try
            {
                posterImageUrl = await mediaService.MovePosterImage(command.PosterImageUrl, command.Title, "video", "series");
            }catch(Exception ex)
            {
                await mediaService.DeleteFileAsync(command.PosterImageUrl);
                throw new InternalServerException(ex.Message);
            }

            Series series = new Series(
                    command.Title,
                    command.Description,
                    LanguageList.Languages
                        .Where(x => command.Languages
                            .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                        .ToList(),
                    CountryList.Countries
                    .Where(x => command.Countries
                        .Any(c => c.Equals(x, StringComparison.OrdinalIgnoreCase))).ToList(),
                    command.AgeGroup,
                    command.ImdbRating,
                    command.PublishedDate,
                    posterImageUrl

            );

            foreach (string g in command.Genres)
            {
                Genre? genre = await movieRepo.GetGenreAsync(g);
                if (genre == null)
                {
                    genre = await movieRepo.AddGenreAsync(new Genre(g));

                }
                series.AddGenre(genre);
            }

            // 5. Add directors
            foreach (string d in command.Directors)
            {
                Director? director = await movieRepo.GetDirectorAsync(d);
                if (director == null) director = await movieRepo.AddDirectorAsync(new Director(d));
                series.AddDirector(director);
            }

            foreach (string actorName in command.Actors)
            {


                Actor? actor = await movieRepo.GetActorAsync(actorName);
                if (actor == null)
                {
                    actor = await movieRepo.AddActorAsync(new Actor(actorName));
                }
                series.AddActor(actor);
            }

            try
            {
                await seriesRepo.AddSeriesAsync(series);
            }
            catch (DbUpdateException ex)
            {
                await mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(posterImageUrl), true);
                if (ex.InnerException.Message.IndexOf("duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase) >= 0)
                    throw new BadRequestException("Series with this Title and Pusblish Date is already exists");
                throw;

            }

            return series.ToSeriesDto();
        }
    }

    
}
