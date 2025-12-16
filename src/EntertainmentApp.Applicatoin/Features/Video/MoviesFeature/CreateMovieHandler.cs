namespace EntertainmentApp.Applicatoin.Features.Video.MoviesFeature
{
    public class CreateMovieHandler
    {

        public class CreateMovieCommand() : ICommand<Movie>
        {
            public string Title { get; set; }
            public string Description { get; set; } = string.Empty;
            public List<string> Genres { get; set; }
            public List<string> Languages { get; set; }
            public List<string> Countries { get; set; }
            public int AgeGroup { get; set; }
            public List<string> Directors { get; set; } = new List<string>();
            public List<string> Actors { get; set; } = new List<string>();
            public decimal ImdbRating { get; set; }
            public int PublishedDate { get; set; }
            public string PosterImageUrl { get; set; }
            public string PosterImageFileName { get; set; }
            public string StreamUrl { get; set; }
            public string StreamFileName { get; set; }
        }
        public class CreateMovieCommandVlidator : AbstractValidator<CreateMovieCommand>
        {
            public CreateMovieCommandVlidator()
            {
                RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
                RuleFor(x => x.StreamUrl).NotEmpty().WithMessage("Media is required");
                RuleFor(x => x.PosterImageUrl).NotEmpty().WithMessage("Poster image is required");
                RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required");
                RuleFor(x => x.PublishedDate).NotNull().WithMessage("Published Date is required").GreaterThan(0).WithMessage("Publishe Date must be grather than zero");
                RuleFor(x => x.AgeGroup).NotNull().WithMessage("Age group is required").GreaterThan(0).WithMessage("Age group can not be negetive");
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

                RuleFor(x => x.StreamUrl).NotEmpty().WithMessage("Video file was not stored. try again");
                RuleFor(x => x.StreamFileName).NotEmpty().WithMessage("Video file name is not valid")
                    .Must(x => ValidExtensionList.VideoExtension.Contains(Path.GetExtension(x), StringComparer.OrdinalIgnoreCase))
                    .WithMessage($"Invalid video file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.VideoExtension)}");
                RuleFor(x => x.PosterImageUrl).NotEmpty().WithMessage("Poster Image file was not stored. try again");
                RuleFor(x => x.PosterImageFileName).NotEmpty().WithMessage("Poster Image file name is not valid")
                    .Must(x => ValidExtensionList.ImageExtension.Contains(Path.GetExtension(x), StringComparer.OrdinalIgnoreCase))
                    .WithMessage($"Invalid image file extension. Supported extensions are: {string.Join(", ", ValidExtensionList.ImageExtension)}"); ;
            }
        }
        public class CreateMovieCommandHandler : ICommandHandler<CreateMovieCommand, Movie>
        {
            private readonly IMovieRepository _movieRepo;
            private readonly IMediaService _mediaService;
            public CreateMovieCommandHandler(IMovieRepository movieRepo, IMediaService mediaService)
            {
                _movieRepo = movieRepo;
                _mediaService = mediaService;
            }

            public async Task<Movie> Handle(CreateMovieCommand command, CancellationToken cancellationToken)
            {
                Movie movie = new Movie(
                    command.Title,
                    command.Description,
                    LanguageList.Languages
                        .Where(x => command.Languages
                            .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                        .ToList(),
                    CountryList.Countries
                    .Where( x => command.Countries
                        .Any( c => c.Equals(x, StringComparison.OrdinalIgnoreCase) )).ToList(),
                    command.AgeGroup,
                    command.ImdbRating,
                    command.PublishedDate,
                    command.StreamUrl, 
                    command.PosterImageUrl

                    );

                foreach (string g in command.Genres)
                {
                    Genre? genre = await _movieRepo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = await _movieRepo.AddGenreAsync(new Genre(g));
                        
                    }
                    movie.AddGenre(genre);
                }

                // 5. Add directors
                foreach (string d in command.Directors)
                {
                    Director? director = await _movieRepo.GetDirectorAsync(d);
                    if (director == null) director = await _movieRepo.AddDirectorAsync(new Director(d));
                    movie.AddDirector(director);
                }

                // 6. Add actors
                foreach (string a in command.Actors)
                {
                    Actor? actor = await _movieRepo.GetActorAsync(a);
                    if (actor == null) actor = await _movieRepo.AddActorAsync(new Actor(a));
                    movie.AddActor(actor);
                    
                }
                try
                {
                    await _movieRepo.AddMovieAsync(movie);
                }catch (DbUpdateException ex)
                {
                    await _mediaService.DeleteMediaFilesAsync(movie.StreamUrl, movie.PosterImageUrl, true);
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(movie.StreamUrl), true);
                    if (ex.InnerException.Message.IndexOf("duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase) >= 0)
                        throw new BadRequestException("Movie with this Title and Pusblish Date is already exists");
                    throw;
                    
                }

                return  movie;
            }
        }
    }
}
