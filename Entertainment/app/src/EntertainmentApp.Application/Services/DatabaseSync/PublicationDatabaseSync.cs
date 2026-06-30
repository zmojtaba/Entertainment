namespace EntertainmentApp.Application.Services.DatabaseSync
{
    public class PublicationDatabaseSync : IPublicationDatabaseSync
    {
        private readonly IPublicationRepository _repo;
        private readonly IMediaService _mediaService;
        private readonly ILogger<PublicationDatabaseSync> _logger;
        public PublicationDatabaseSync(IMediaService mediaService, ILogger<PublicationDatabaseSync> logger, IPublicationRepository repo)
        {
            _mediaService = mediaService;
            _logger = logger;
            _repo = repo;
        }

        public async Task<DatabaseCategorySyncedResult> SyncNewsPaperAsync(List<NewsPaperDto> entities)
        {

            //if (!entities.Any())
            //{
            //    _logger.LogError("Sync NewsPaper:  NewsPapers cannot be empty.");
            //    return null;
            //}
            List<Guid> dtoIds = entities.Select(x => x.Id).ToList();
            List<Guid> addIds = await _repo.GetNotExistNewsPapersId(dtoIds);
            List<Guid> deleteIds = await _repo.GetNotExistOnSeverNewsPapersId(dtoIds);
            List<object> addedOjbects = new List<object>();
            List<object> deletedOjbects = new List<object>();


            if (deleteIds.Any())
            {
                foreach (Guid id in deleteIds)
                {
                    NewsPaper newsPaper = await _repo.GetNewsPaperByIdAsync(id);
                    await _repo.DeleteNewsPaperAsync(newsPaper);
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(newsPaper.PosterImageUrl), true);
                    deletedOjbects.Add(newsPaper.ToNewsPaperDto());

                }
            }

            foreach (Guid id in addIds)
            {
                NewsPaperDto dto = entities.FirstOrDefault(x => x.Id == id);
                if (dto == null)
                {
                    _logger.LogError($"**i NewsPaper with id {id} not found in DTO list");
                    continue;

                }

                NewsPaper paper = new NewsPaper(
                    dto.Title,
                    LanguageList.Languages
                        .Where(x => dto.Languages
                            .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                        .ToList(),
                    dto.PublishedDate,
                    dto.StreamUrl,
                    dto.PosterImageUrl
                    );

                paper.ChangeId(dto.Id);
                paper.ChangeDownloadStatus(DownloadStatus.InQueue);
                foreach (string g in dto.Genres)
                {
                    Genre? genre = await _repo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = await _repo.AddGenreAsync(new Genre(g));
                        genre.AddCategory("publication");
                    }
                    paper.AddGenre(genre);
                }

                Publisher? publisher = await _repo.GetPublisherAsync(dto.Publisher.Name);
                if (publisher == null)
                {
                    publisher = await _repo.AddPublisherAsync(new Publisher(dto.Publisher.Name));
                }
                paper.SetPublisher(publisher);


                paper.ChangeDownloadStatus(DownloadStatus.InQueue);
                await _repo.AddNewsPaperAsync(paper);

                addedOjbects.Add(paper.ToNewsPaperDto());
            }

            return new DatabaseCategorySyncedResult { Added = addedOjbects, Deleted = deletedOjbects };
        }



        public async Task<DatabaseCategorySyncedResult> SyncMagazineAsync(List<MagazineDto> entities)
        {

            //if (!entities.Any())
            //{
            //    _logger.LogError("Sync Magazine:  Magazine cannot be empty.");
            //    return null;
            //}
            List<Guid> dtoIds = entities.Select(x => x.Id).ToList();
            List<Guid> addIds = await _repo.GetNotExistMagazinesId(dtoIds);
            List<Guid> deleteIds = await _repo.GetNotExistOnSeverMagazinesId(dtoIds);
            List<object> addedOjbects = new List<object>();
            List<object> deletedOjbects = new List<object>();


            if (deleteIds.Any())
            {
                foreach (Guid id in deleteIds)
                {
                    Magazine paper = await _repo.GetMagazineByIdAsync(id);
                    await _repo.DeleteMagazineAsync(paper);
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(paper.PosterImageUrl), true);
                    deletedOjbects.Add(paper.ToMagazineDto());

                }
            }

            foreach (Guid id in addIds)
            {
                MagazineDto dto = entities.FirstOrDefault(x => x.Id == id);
                if (dto == null)
                {
                    _logger.LogError($"**i Magazine with id {id} not found in DTO list");
                    continue;

                }

                Magazine paper = new Magazine(
                    dto.Title,
                    LanguageList.Languages
                        .Where(x => dto.Languages
                            .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                        .ToList(),
                    dto.PublishedDate,
                    dto.StreamUrl,
                    dto.PosterImageUrl
                    );

                paper.ChangeId(dto.Id);
                paper.ChangeDownloadStatus(DownloadStatus.InQueue);
                foreach (string g in dto.Genres)
                {
                    Genre? genre = await _repo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = await _repo.AddGenreAsync(new Genre(g));
                        genre.AddCategory("magazine");
                    }
                    paper.AddGenre(genre);
                }

                Publisher? publisher = await _repo.GetPublisherAsync(dto.Publisher.Name);
                if (publisher == null)
                {
                    publisher = await _repo.AddPublisherAsync(new Publisher(dto.Publisher.Name));
                }
                paper.SetPublisher(publisher);


                paper.ChangeDownloadStatus(DownloadStatus.InQueue);
                await _repo.AddMagazineAsync(paper);

                addedOjbects.Add(paper.ToMagazineDto());
            }

            return new DatabaseCategorySyncedResult { Added = addedOjbects, Deleted = deletedOjbects };
        }
    }
}
