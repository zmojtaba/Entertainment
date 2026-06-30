namespace EntertainmentApp.Application.Services.DatabaseSync
{
    public class CoruDatabaseSync : ICoruDatabaseSync
    {
        private readonly ICoruRepository _repo;
        private readonly IMediaService _mediaService;
        private readonly ILogger<CoruDatabaseSync> _logger;
        public CoruDatabaseSync(IMediaService mediaService, ILogger<CoruDatabaseSync> logger, ICoruRepository repo)
        {
            _mediaService = mediaService;
            _logger = logger;
            _repo = repo;
        }


        public async Task<DatabaseCategorySyncedResult> SyncCoruAsync(List<CoruDto> entities)
        {

            //if (!entities.Any())
            //{
            //    _logger.LogError("Sync Coru:  Coru cannot be empty.");
            //    return null;
            //}
            List<Guid> dtoIds = entities.Select(x => x.Id).ToList();
            List<Guid> addIds = await _repo.GetNotExistCorusId(dtoIds);
            List<Guid> deleteIds = await _repo.GetNotExistOnSeverCorusId(dtoIds);
            List<object> addedOjbects = new List<object>();
            List<object> deletedOjbects = new List<object>();


            if (deleteIds.Any())
            {
                foreach (Guid id in deleteIds)
                {
                    Coru coru = await _repo.GetCoruByIdAsync(id);
                    await _repo.DeleteCoruAsync(coru);
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(coru.StreamUrl), true);
                    deletedOjbects.Add(coru.ToCoruDto());

                }
            }

            foreach (Guid id in addIds)
            {
                CoruDto dto = entities.FirstOrDefault(x => x.Id == id);
                if (dto == null)
                {
                    _logger.LogError($"**i Coru with id {id} not found in DTO list");
                    continue;
                }


                Coru coru = new Coru
                {
                    Title = dto.Title,
                    Country = CountryList.Countries
                                .Where(x => x.ToLower() == dto.Country.ToLower()).First(),
                    City = dto.City,
                    StreamUrl = dto.StreamUrl,

                };

                coru.ChangeId(dto.Id);
                coru.ChangeDownloadStatus(DownloadStatus.InQueue);
                coru.ChangeDownloadStatus(DownloadStatus.InQueue);
                await _repo.AddCoruAsync(coru);

                addedOjbects.Add(coru.ToCoruDto());
            }

            return new DatabaseCategorySyncedResult { Added = addedOjbects, Deleted = deletedOjbects };
        }




    }
}
