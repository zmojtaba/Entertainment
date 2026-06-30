namespace EntertainmentApp.Application.Common.Models
{
    public class DownloadItem
    {
        public Guid Id { get; set; }
        public MediaType Type { get; set; }

        public bool CurrentlyDownload { get; set; } = false;
    }
}
