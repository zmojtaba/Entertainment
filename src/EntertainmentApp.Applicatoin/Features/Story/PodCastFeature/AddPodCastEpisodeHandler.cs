using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Applicatoin.Interfaces.Media;
using EntertainmentApp.Domain.Entities.Story;
using EntertainmentApp.Domain.Entities.Video;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.Story.PodCastFeature
{
    public class AddPodCastEpisodeHandler
    {
        public class AddPodCastEpisodeCommand : ICommand<PodCastDto>
        {
            public string Title { get;  set; }
            public string TempStreamUrl { get;  set; }
            public Guid PodCastId { get; set; }


        }
        //public class AddPodCastEpisodeCommandValidator
        public class AddPodCastEpisodeCommandHandler(IStoryRepository storyRepo, IMediaService mediaService) : ICommandHandler<AddPodCastEpisodeCommand, PodCastDto>
        {
            public async Task<PodCastDto> Handle(AddPodCastEpisodeCommand command, CancellationToken cancellationToken)
            {
                if (command.PodCastId == null) throw new BadRequestException("Title is required");
                if (string.IsNullOrEmpty(command.Title)) throw new BadRequestException("Title is required");
                if (string.IsNullOrEmpty(command.TempStreamUrl)) throw new BadRequestException("Media file url is required");

                PodCast podcast = await storyRepo.GetPodCastByIdAsync(command.PodCastId);
                if (podcast == null)
                {
                    mediaService.DeleteMediaFilesAsync(command.TempStreamUrl, "");
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
                    await mediaService.DeleteMediaFilesAsync(episode.StreamUrl, "", true);
                    if (ex.InnerException.Message.IndexOf("duplicate key value violates unique constraint", StringComparison.OrdinalIgnoreCase) >= 0)
                        throw new BadRequestException("Episode with this Title already exists for this Podcast");
                    throw;

                }
                catch(Exception ex)
                {
                    throw new InternalServerException(ex.Message);
                }

                podcast.AddEpisode(episode);
                await storyRepo.UpdatePodCastAsync(podcast);
                return podcast.ToPodCastDto();



            }
        }
    }
}
