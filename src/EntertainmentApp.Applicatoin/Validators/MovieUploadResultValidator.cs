using EntertainmentApp.Applicatoin.Common.Constants;
using EntertainmentApp.Applicatoin.Common.Models;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Infrastructure.Services
{
    public class MovieUploadResultValidator : AbstractValidator<MediaUploadResult>
    {
        public MovieUploadResultValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.StreamUrl).NotEmpty().WithMessage("Media is required");
            RuleFor(x => x.ImageUrl).NotEmpty().WithMessage("Poster image is required");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required");
            RuleFor(x => x.PublishedDate).NotNull().WithMessage("Published Date is required").GreaterThan(0).WithMessage("Publishe Date must be grather than zero");
            RuleFor(x => x.AgeGroup).NotNull().WithMessage("Age group is required").GreaterThan(0).WithMessage("Age group can not be negetive");
            RuleFor(x => x.Genres)
                            .NotNull().NotEmpty().WithMessage("At least one Genre is required");


            RuleFor(x => x.Actors)
                .NotNull().NotEmpty().WithMessage("At least one Actor is required");


            RuleFor(x => x.Directors)
                .NotNull().NotEmpty().WithMessage("At least one Director is required");



            RuleFor(x => x.Languages)
                .NotNull().NotEmpty().WithMessage("At least one Language is required");
            RuleForEach(x => x.Languages)
                .Must(l => LanguageList.Languages.Contains(l))
                .WithMessage("Language {PropertyValue} is not supported.");


            RuleFor(x => x.Countries)
                .NotNull().NotEmpty().WithMessage("At least one country is required");
            RuleForEach(x => x.Countries)
                .Must(c => CountryList.Countries.Contains(c))
                .WithMessage("Country {PropertyValue} is not valid.");

        }

    }
}
