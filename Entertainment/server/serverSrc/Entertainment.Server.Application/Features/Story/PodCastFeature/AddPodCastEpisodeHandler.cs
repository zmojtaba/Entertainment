namespace Entertainment.Server.Applicatoin.Features.Story.PodCastFeature
{
    public class AddPodCastEpisodeCommand : ICommand<PodCastDto>
    {
        public string Title { get; set; }
        public string TempStreamUrl { get; set; }
        public Guid AudioStoryId { get; set; }


    }
    public class AddPodCastEpisodeCommandValidator : AbstractValidator<AddPodCastEpisodeCommand>
    {
        public AddPodCastEpisodeCommandValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.AudioStoryId).NotEmpty().NotNull().WithMessage("Id is required");
            RuleFor(x => x.TempStreamUrl).NotEmpty().WithMessage("Media file url is required");
        }
    }
    public class AddPodCastEpisodeHandler(IStoryRepository storyRepo, IMediaService mediaService) : ICommandHandler<AddPodCastEpisodeCommand, PodCastDto>
    {
        public async Task<PodCastDto> Handle(AddPodCastEpisodeCommand command, CancellationToken cancellationToken)
        {
            //if (command.AudioStoryId == null) throw new BadRequestException("Title is required");
            //if (string.IsNullOrEmpty(command.Title)) throw new BadRequestException("Title is required");
            //if (string.IsNullOrEmpty(command.TempStreamUrl)) throw new BadRequestException("Media file url is required");

            PodCast podcast = await storyRepo.GetPodCastByIdAsync(command.AudioStoryId);
            if (podcast == null)
            {
                mediaService.DeleteFileAsync(command.TempStreamUrl);
                throw new NotFoundException("PodCast Not found");
            }

            string streamUrl = await mediaService.MoveStreamToExistenceDirectoryAsync(
                    command.TempStreamUrl,
                    Path.GetDirectoryName(podcast.PosterImageUrl));

            PodCastEpisode episode = new PodCastEpisode(command.Title, streamUrl);
            try
            {
                await storyRepo.AddPodCastEpisodeAsync(episode);
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
                throw new InternalServerException(ex.Message);
            }

            podcast.AddEpisode(episode);
            await storyRepo.UpdatePodCastAsync(podcast);
            return podcast.ToPodCastDto();
        }
    }
}

