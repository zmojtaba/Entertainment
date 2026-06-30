namespace EntertainmentApp.Application.Common.Dtos
{
    public class DownloadItemDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; }

        public bool CurrentlyDownload { get; set; } = false;
    }
}
