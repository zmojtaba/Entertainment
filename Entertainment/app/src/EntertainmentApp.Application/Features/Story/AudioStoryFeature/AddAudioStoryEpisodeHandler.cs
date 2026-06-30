namespace EntertainmentApp.Application.Features.Story.AudioStoryFeature
{
    public class AddAudioStoryEpisodeCommand : ICommand<AudioStoryDto>
    {
        public string Title { get; set; }
        public string TempStreamUrl { get; set; }
        public Guid AudioStoryId { get; set; }


    }
    public class AddAudioStoryEpisodeCommandValidator : AbstractValidator<AddAudioStoryEpisodeCommand>
    {
        public AddAudioStoryEpisodeCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.AudioStoryId).NotEmpty().NotNull().WithMessage("Id is required");
            RuleFor(x => x.TempStreamUrl).NotEmpty().WithMessage("Media file url is required");
        }
    }
    public class AddAudioStoryEpisodeHandler(IStoryRepository storyRepo, IMediaService mediaService)
            : ICommandHandler<AddAudioStoryEpisodeCommand, AudioStoryDto>
    {
        public async Task<AudioStoryDto> Handle(AddAudioStoryEpisodeCommand command, CancellationToken cancellationToken)
        {
            AudioStory audioStory = await storyRepo.GetAudioStoryByIdAsync(command.AudioStoryId);
            if (audioStory == null)
            {
                mediaService.DeleteFileAsync(command.TempStreamUrl);
                throw new NotFoundException("Audio Story Not found");
            }

            string streamUrl = await mediaService.MoveStreamToExistenceDirectoryAsync(
                    command.TempStreamUrl,
                    Path.GetDirectoryName(audioStory.PosterImageUrl));

            AudioStoryEpisode episode = new AudioStoryEpisode(command.Title, streamUrl);
            try
            {
                await storyRepo.AddAudioStoryEpisodeAsync(episode);
            }
            catch (DbUpdateException ex)
            {
                await mediaService.DeleteFileAsync(episode.StreamUrl, true);
                if (ex.InnerException.Message.IndexOf("duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase) >= 0)
                    throw new BadRequestException("Episode with this Title already exists for this Podcast");
                throw;

            }
            catch (Exception ex)
            {
                await mediaService.DeleteFileAsync(episode.StreamUrl, true);
                throw new InternalServerException(ex.Message);
            }

            audioStory.AddEpisode(episode);
            await storyRepo.UpdateAudioStoryAsync(audioStory);
            return audioStory.ToAudioStoryDto();
        }
    }
}
