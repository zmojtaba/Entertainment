using Entertainment.Server.Applicatoin.Interfaces;
using Entertainment.Server.Domain.Entities.Story;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entertainment.Server.Applicatoin.Features.Story.AudioStoryFeature
{
    public class UpdateAudioStoryCommand : ICommand<AudioStoryDto>
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> Languages { get; set; } = new List<string>();
        public int AgeGroup { get; set; }
        public string? PosterImageUrl { get; set; } = string.Empty;
        public List<string> Genres { get; set; } = new List<string>();
        public List<string> Speakers { get; set; } = new List<string>();
    }

    public class UpdateAudioStoryCommandValidator : AbstractValidator<UpdateAudioStoryCommand>
    {
        public UpdateAudioStoryCommandValidator()
        {
            RuleFor(x => x.Id).NotNull().WithMessage("Id is required");
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
            RuleFor(x => x.Languages).NotEmpty().WithMessage("At least one language is required.");
            RuleFor(x => x.AgeGroup).GreaterThan(0).WithMessage("Age group cannot be negative.");
            RuleFor(x => x.Genres)
                .NotNull().WithMessage("Genre is required");
            RuleForEach(x => x.Genres).NotEmpty().WithMessage("Genre can not contains empty string");


            RuleFor(x => x.Speakers)
                .NotNull().WithMessage("Speaker is required");
            RuleForEach(x => x.Speakers).NotEmpty().WithMessage("Speaker can not contains empty string");

            RuleFor(x => x.Languages)
                .NotNull().WithMessage("Language is required");
            RuleForEach(x => x.Languages)
                .NotEmpty().WithMessage("Language can not contains empty string")
                .Must(l => LanguageList.Languages.Contains(l, StringComparer.OrdinalIgnoreCase))
                .WithMessage("Language {PropertyValue} is not supported.");
        }
    }

    public class UpdateAudioStoryHandler(IStoryRepository storyRepo, IMediaService mediaService) : ICommandHandler<UpdateAudioStoryCommand, AudioStoryDto>
    {
        public async Task<AudioStoryDto> Handle(UpdateAudioStoryCommand command, CancellationToken cancellationToken)
        {
            AudioStory? audioStory = await storyRepo.GetAudioStoryByIdAsync(command.Id);
            if (audioStory == null) throw new NotFoundException("Audio Story Not found");

            if (!string.IsNullOrEmpty(command.PosterImageUrl))
            {
                string posterImageUrl = await mediaService.MoveStreamToExistenceDirectoryAsync(
                    command.PosterImageUrl,
                    Path.GetDirectoryName(audioStory.PosterImageUrl));

                mediaService.DeleteFileAsync( audioStory.PosterImageUrl, true);

                audioStory.SetPosterImageUrl(posterImageUrl);
            }



            audioStory.SetTitle(command.Title);
            audioStory.SetDescription(command.Description);
            audioStory.SetLanguages(LanguageList.Languages
                .Where(x => command.Languages
                    .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                .ToList());
            audioStory.SetAgeGroup(command.AgeGroup);




            audioStory.RemoveGenres();
            foreach (string g in command.Genres)
            {
                Genre? genre = await storyRepo.GetGenreAsync(g);
                if (genre == null)
                {
                    genre = await storyRepo.AddGenreAsync(new Genre(g));
                    genre.AddCategory("story");
                }
                audioStory.AddGenre(genre);
            }

            // 5. Add directors
            audioStory.RemoveSpeaker();
            foreach (var speakerName in command.Speakers)
            {
                var speaker = await storyRepo.GetSpeakerAsync(speakerName);
                if (speaker == null)
                {
                    speaker = new Speaker(speakerName);
                    speaker = await storyRepo.AddSpeakerAsync(speaker);
                }
                audioStory.Speakers.Add(speaker);
            }

            await storyRepo.UpdateAudioStoryAsync(audioStory);

            return audioStory.ToAudioStoryDto();

        }
    }
}
