using EntertainmentApp.Applicatoin.Common.Dtos;
using EntertainmentApp.Domain.Entities.Shared;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace EntertainmentApp.Applicatoin.Features.Video.UpdateMovie
{
    public class UpdateMovieCommand : ICommand<MovieDto>
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string> Languages { get; set; } = new List<string>();
        public List<string> Countries { get; set; } = new List<string>();
        public int AgeGroup { get; set; }
        public decimal ImdbRating { get; set; }
        public int PublishedDate { get; set; }
        public List<string> Genres { get; set; } = new();
        public List<string> Directors { get; set; } = new();
        public List<string> Actors { get; set; } = new();
    }

    public class UpdateMovieCommandVlidator : AbstractValidator<UpdateMovieCommand>
    {
        public UpdateMovieCommandVlidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Movie Id is required");
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required");
            RuleFor(x => x.PublishedDate).NotNull().WithMessage("Published Date is required").GreaterThan(0).WithMessage("Publishe Date must be grather than zero");
            RuleFor(x => x.AgeGroup).NotNull().WithMessage("Age group is required").GreaterThan(0).WithMessage("Age group can not be negetive");
            
            
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

    public class UpdateMovieHandler(IMovieRepository movieRepo, IMediaService mediaService) : ICommandHandler<UpdateMovieCommand, MovieDto>
    {

        public async Task<MovieDto> Handle(UpdateMovieCommand command, CancellationToken cancellationToken)
        {
            Movie movie = await movieRepo.GetMovieByIdAsync(command.Id);
            if (movie == null) throw new NotFoundException("Movie not found");

            if (!movie.Title.Equals(command.Title, StringComparison.OrdinalIgnoreCase))
            {
                string newMediaDirectory =  await mediaService.MoveMediaDirectory(Path.GetDirectoryName(movie.StreamUrl), command.Title, "video", "movie", true);
                movie.SetStreamUrl(Path.Combine(
                    newMediaDirectory, 
                    Path.GetFileName(movie.StreamUrl)
                    ));
                movie.SetPosterImageUrl(Path.Combine(
                    newMediaDirectory,
                    Path.GetFileName(movie.PosterImageUrl)
                    ));
                Console.WriteLine(newMediaDirectory);
                
            }



            movie.SetTitle(command.Title);
            movie.SetDescription(command.Description);
            movie.SetLanguages(LanguageList.Languages
                .Where(x => command.Languages
                    .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                .ToList());
            movie.SetCountries(CountryList.Countries
                    .Where(x => command.Countries
                        .Any(c => c.Equals(x, StringComparison.OrdinalIgnoreCase))).ToList());
            movie.SetAgeGroup(command.AgeGroup);
            movie.SetImdbRating(command.ImdbRating);
            movie.SetPublishedDate(command.PublishedDate);



            movie.RemoveGenres();
            foreach (string g in command.Genres)
            {
                Genre? genre = await movieRepo.GetGenreAsync(g);
                if (genre == null)
                {
                    genre = await movieRepo.AddGenreAsync(new Genre(g));

                }
                movie.AddGenre(genre);
            }

            // 5. Add directors
            movie.RemoveDirectors();
            foreach (string d in command.Directors)
            {
                Director? director = await movieRepo.GetDirectorAsync(d);
                if (director == null) director = await movieRepo.AddDirectorAsync(new Director(d));
                movie.AddDirector(director);
            }

            // 6. Add actors
            movie.RemoveActors();
            foreach (string a in command.Actors)
            {
                Actor? actor = await movieRepo.GetActorAsync(a);
                if (actor == null) actor = await movieRepo.AddActorAsync(new Actor(a));
                movie.AddActor(actor);

            }

            await movieRepo.UpdateMovieAsync(movie);

            return movie.ToMoveDto();

        }
    }
}
