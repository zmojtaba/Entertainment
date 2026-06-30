
namespace EntertainmentApp.Application.Features.UpdateMedia
{
    public record GetConnectionStatusQuery() : IQuery<GetConnectionStatusResponse>;
    public record GetConnectionStatusResponse(string ConnectionStatus) ;
    public class GetConnectionStatusHandler(IMediaApiClient mediaApiClient) : IQueryHandler<GetConnectionStatusQuery, GetConnectionStatusResponse>
    {
        public async Task<GetConnectionStatusResponse> Handle(GetConnectionStatusQuery request, CancellationToken cancellationToken)
        {
            bool status = await mediaApiClient.IsReachableAsync();
            return status
                ? new GetConnectionStatusResponse("connect")
                : new GetConnectionStatusResponse("disconnect");
        }
    }
}