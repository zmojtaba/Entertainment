using EntertainmentApp.Application.Interfaces.DatabaseSync;

namespace EntertainmentApp.Application.Features.UpdateMedia
{
    public record SyncMediaWithServerCommand() : ICommand<DatabaseSyncedResult>;
    public class SyncMediaWithServerResponse()
    {
    }
    public class SyncMediaWithServerHandler(IMediaApiClient mediaApiClient, 
        IMediator mediator, 
        IDownloadQueueSyncService queueSync,
        IDatabaseSyncService databaseSync) 
        : ICommandHandler<SyncMediaWithServerCommand, DatabaseSyncedResult>
    {
        async Task<DatabaseSyncedResult> IRequestHandler<SyncMediaWithServerCommand, DatabaseSyncedResult>.Handle(SyncMediaWithServerCommand command, CancellationToken cancellationToken)
        {

            if (!await mediaApiClient.IsReachableAsync())
                throw new BadRequestException("Server is not reachable");

            GetAllMediaResponse apiResult = await mediaApiClient.GetAllMediaMetaDataAsync();
            if (apiResult == null) throw new ApplicationException("No Media Metadata");

            //important: consider already update result.


            DatabaseSyncedResult result  = await databaseSync.SyncDatabaseAsync(apiResult);

            await Task.Delay(3000);

            await queueSync.SyncQueueAsync();

            return result;
        }
    }
}
