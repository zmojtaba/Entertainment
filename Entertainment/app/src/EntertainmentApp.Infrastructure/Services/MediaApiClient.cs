using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace EntertainmentApp.Infrastructure.Services
{
    public class MediaApiClient : IMediaApiClient
    {
        private readonly HttpClient _client;

        public MediaApiClient(IHttpClientFactory factory)
        {
            _client = factory.CreateClient("MediaApi");
        }

        public async Task<GetAllMediaResponse> GetAllMediaMetaDataAsync()
        {
            try
            {
                var response = await _client.GetAsync("api/update/all-media/");
                if (!response.IsSuccessStatusCode) throw new BadRequestException("Failed to fetch Media data");
                GetAllMediaResponse? data = await response.Content.ReadFromJsonAsync<GetAllMediaResponse>();
                if (data == null) throw new InternalServerException("Media Data is null");
                return data;
            }
            catch (Exception ex) 
            {
                return null;
            }
        }

        public async Task<bool> IsReachableAsync()
        {
            try
            {
                var response = await _client.GetAsync("health");
                Console.WriteLine("======================= connected to server ==================");
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }
    }
}
