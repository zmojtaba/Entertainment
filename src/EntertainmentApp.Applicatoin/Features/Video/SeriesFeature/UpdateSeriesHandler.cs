using EntertainmentApp.Domain.Entities.Video;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Video.SeriesFeature
{
    public class UpdateSeriesCommand
        : ICommand<SeriesDto>
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

    public class UpdateSeriresCommandValidator : AbstractValidator<UpdateSeriesCommand>
    {
        public UpdateSeriresCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("ID is required");
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required");
            RuleFor(x => x.PublishedDate).NotNull().WithMessage("Published Date is required").GreaterThan(0).WithMessage("Publishe Date must be grather than zero");
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


    public class UpdateSeriesHandler(ISeriesRepository seriesRepo, IMovieRepository movieRepo) : ICommandHandler<UpdateSeriesCommand, SeriesDto>
    {
        public async Task<SeriesDto> Handle(UpdateSeriesCommand command, CancellationToken cancellationToken)
        {

            Series series = await seriesRepo.GetSeriesByIdAsync(command.Id);
            if (series == null) throw new NotFoundException("Series Not found");

            series.SetTitle(command.Title);
            series.SetDescription(command.Description);
            series.SetLanguages(
                LanguageList.Languages
                        .Where(x => command.Languages
                            .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                        .ToList()
                );
            series.SetCountries(
                 CountryList.Countries
                    .Where(x => command.Countries
                        .Any(c => c.Equals(x, StringComparison.OrdinalIgnoreCase))).ToList()
                );
            series.SetAgeGroup(command.AgeGroup);
            series.SetImdbRating(command.ImdbRating);
            series.SetPublishedDate(command.PublishedDate);

            series.RemoveGenres();
            foreach (string g in command.Genres)
            {
                Genre? genre = await movieRepo.GetGenreAsync(g);
                if (genre == null)
                {
                    genre = await movieRepo.AddGenreAsync(new Genre(g));
                    genre.AddCategory("story");
                }
                series.AddGenre(genre);
            }

            // 5. Add directors
            series.RemoveDirectors();
            foreach (string d in command.Directors)
            {
                Director? director = await movieRepo.GetDirectorAsync(d);
                if (director == null) director = await movieRepo.AddDirectorAsync(new Director(d));
                series.AddDirector(director);
            }

            series.RemoveActors();
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
                await seriesRepo.UpdateSeriesAsync(series);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException.Message.IndexOf("duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase) >= 0)
                    throw new BadRequestException("Series with this Title and Pusblish Date is already exists");
                throw;

            }

            return series.ToSeriesDto();

        }
    }



}
