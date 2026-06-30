using System.Globalization;

namespace EntertainmentApp.Domain.Entities.Story
{
    public class Speaker : BaseEntity
    {
        public string Name { get; private set; }
        public string? ImagePath { get; private set; } = string.Empty;
        public List<PodCast> PodCasts { get; private set; } = new List<PodCast>();
        public List<AudioStory> AudioStories { get; private set; } = new List<AudioStory>();
        private Speaker() { }
        public Speaker(string name)
        {
            Name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(name.Trim()); 
        }
    }
}
