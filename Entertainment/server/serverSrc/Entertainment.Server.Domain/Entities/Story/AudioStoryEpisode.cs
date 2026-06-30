using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entertainment.Server.Domain.Entities.Story
{
    public class AudioStoryEpisode : BaseEntity
    {
        public string Title { get; private set; }
        public string StreamUrl { get; private set; }
        public Guid? AudioStoryId { get; set; }
        public AudioStory? AudioStory { get; set; }
        private AudioStoryEpisode() { }
        public AudioStoryEpisode(string title, string streamUrl)
        {
            SetTitle(title);
            SetStreamUrl(streamUrl);
        }

        public AudioStoryEpisode(string title, string streamUrl, AudioStory audioStory)
        {
            SetTitle(title);
            SetStreamUrl(streamUrl);
            SetAudioStory(audioStory);
        }

        // ------------------------------
        // Setters (Encapsulated Changes)
        // ------------------------------
        public void SetTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new DomainException("Title cannot be empty.");
            Title = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(title.Trim());
        }
        public void SetStreamUrl(string streamUrl)
        {
            if (string.IsNullOrWhiteSpace(streamUrl))
                throw new DomainException("Stream URL cannot be empty.");
            StreamUrl = streamUrl;
        }

        public void SetAudioStory(AudioStory audioStory)
        {
            if (audioStory == null)
                throw new DomainException("PodCast cannot be empty.");
            AudioStory = audioStory;
            AudioStoryId = audioStory.Id;
        }
    }
}
