namespace EntertainmentApp.Application.Interfaces.Media
{
    public interface IMediaApiClient
    {
        public Task<GetAllMediaResponse> GetAllMediaMetaDataAsync();
        public Task<bool> IsReachableAsync();
    }
}
