namespace EntertainmentApp.Application.Common.Models
{
    public class DownloadProgress
    {
        public Guid? Id { get; set; }
        //public Guid? EpisodeId { get; set; }
        public string MediaType { get; set; }
        public string FileType { get; set; }
        public double Percentage { get; set; }
        public long DownloadedBytes { get; set; }
        public long TotalBytes { get; set; }
        public DownloadStatus? Status { get; set; } = DownloadStatus.Downloading;
        public string? ErrorMessage { get; set; }

    }
}
