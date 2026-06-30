namespace Entertainment.Server.Applicatoin.Common.Dtos
{
    public class PodCastDto
    {
        public Guid Id { get; set; }
        public string Title { get;  set; } = string.Empty;
        public string Description { get;  set; } = string.Empty;
        public List<string> Languages { get;  set; } = new ();
        public int AgeGroup { get;  set; } = default;
        public string PosterImageUrl { get;  set; } = string.Empty;
        public List<string> Genres { get; set; } = new ();
        public List<SpeakerDto> Speakers { get;  set; } = new();
        public List<PodCastEpisodeDto> Episodes { get; set; } = new();
    }

    public class SpeakerDto
    {
        public string Name { get; set; } = string.Empty;
        public string? ImagePath { get; set; }
    }
    public class PodCastEpisodeDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string StreamUrl { get; set; } = string.Empty;
    }
}
