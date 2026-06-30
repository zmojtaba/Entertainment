namespace EntertainmentApp.Application.Interfaces.Media
{
    public interface IMediaDownloader
    {
        MediaType Type { get; }
        Task DownloadAsync(Guid id, CancellationToken ct);
    }
}
