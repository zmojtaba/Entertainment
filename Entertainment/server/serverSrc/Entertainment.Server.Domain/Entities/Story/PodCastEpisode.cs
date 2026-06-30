using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Entertainment.Server.Domain.Entities.Story
{
    public class PodCastEpisode : BaseEntity
    {
        public string Title { get; private set; }
        public string StreamUrl { get; private set; }
        public Guid? PodCastId { get; set; }
        public PodCast? PodCast { get; set; }
        private PodCastEpisode() { }
        public PodCastEpisode(string title, string streamUrl)
        {
            SetTitle(title);
            SetStreamUrl(streamUrl);
        }

        public PodCastEpisode(string title, string streamUrl, PodCast podCast)
        {
            SetTitle(title);
            SetStreamUrl(streamUrl);
            SetPodCast(podCast);
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

        public void SetPodCast(PodCast podCast)
        {
            if (podCast == null)
                throw new DomainException("PodCast cannot be empty.");
            PodCast = podCast;
            PodCastId = podCast.Id;
        }

    }
}
