namespace EntertainmentApp.Application.Services.DatabaseSync
{
    public class StoryDtabaseSync : IStoryDtabaseSync
    {
        private readonly IStoryRepository _repo;
        private readonly IMediaService _mediaService;
        private readonly ILogger<StoryDtabaseSync> _logger;
        public StoryDtabaseSync(IMediaService mediaService, ILogger<StoryDtabaseSync> logger, IStoryRepository repo)
        {
            _mediaService = mediaService;
            _logger = logger;
            _repo = repo;
        }
        public async Task<DatabaseCategorySyncedResult> SyncAudioStoryAsync(List<AudioStoryDto> entities)
        {
            //if (!entities.Any())
            //{
            //    _logger.LogError("Sync AudioStory:  AudioStory cannot be empty.");
            //    return null;
            //}
            List<Guid> dtoIds = entities.Select(x => x.Id).ToList();
            List<Guid> deleteIds = await _repo.GetNotExistOnSeverAudioStoriesId(dtoIds);
            List<Guid> addIds = await _repo.GetNotExistAudioStoriesId(dtoIds);


            List<object> addedOjbects = new List<object>();
            List<object> deletedOjbects = new List<object>();


            if (deleteIds.Any())
            {
                foreach (Guid id in deleteIds)
                {
                    AudioStory audioStory = await _repo.GetAudioStoryByIdAsync(id);
                    if (audioStory == null) continue;
                    await _repo.DeleteAudioStoryAsync(audioStory);
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(audioStory.PosterImageUrl), true);
                    deletedOjbects.Add(audioStory.ToAudioStoryDto());

                }
            }

            foreach (Guid id in addIds)
            {
                AudioStoryDto dto = entities.FirstOrDefault(x => x.Id == id);

                if (dto == null)
                {
                    _logger.LogError($"**i AudioStory with id {id} not found in DTO list");
                    continue;
                }


                AudioStory audioStory = new AudioStory(
                   dto.Title,
                   dto.Description,
                   LanguageList.Languages
                       .Where(x => dto.Languages
                           .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                       .ToList(),
                   dto.AgeGroup,
                   dto.PosterImageUrl
               );
                audioStory.ChangeId(dto.Id);
                audioStory.ChangeDownloadStatus(DownloadStatus.InQueue);
                // Handle Genres
                foreach (string g in dto.Genres)
                {
                    Genre genre = await _repo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = new Genre(g);
                        genre = await _repo.AddGenreAsync(genre);
                    }
                    audioStory.Genres.Add(genre);
                }
                // Handle Speakers
                foreach (var s in dto.Speakers)
                {
                    Speaker speaker = await _repo.GetSpeakerAsync(s.Name);
                    if (speaker == null)
                    {
                        speaker = new Speaker(s.Name);
                        speaker = await _repo.AddSpeakerAsync(speaker);
                    }
                    audioStory.Speakers.Add(speaker);
                }

                if (!dto.Episodes.Any())
                {
                    audioStory.ChangeDownloadStatus(DownloadStatus.Completed);
                    await _repo.AddAudioStoryAsync(audioStory);
                    addedOjbects.Add(audioStory.ToAudioStoryDto());
                    continue;
                }

                foreach (var epDto in dto.Episodes)
                {
                    AudioStoryEpisode episode = new AudioStoryEpisode(epDto.Title, epDto.StreamUrl);

                    episode.ChangeId(epDto.Id);
                    episode.ChangeDownloadStatus(DownloadStatus.InQueue);
                    audioStory.AddEpisode(episode);
                }



                await _repo.AddAudioStoryAsync(audioStory);
                addedOjbects.Add(audioStory.ToAudioStoryDto());
            }
            return new DatabaseCategorySyncedResult { Added = addedOjbects, Deleted = deletedOjbects };

        }

        public async Task<DatabaseCategorySyncedResult> SyncBookAsync(List<BookDto> entities)
        {

            //if (!entities.Any())
            //{
            //    _logger.LogError("Sync Book:  Books cannot be empty.");
            //    return null;
            //}
            List<Guid> dtoIds = entities.Select(x => x.Id).ToList();
            List<Guid> addIds = await _repo.GetNotExistBooksId(dtoIds);
            List<Guid> deleteIds = await _repo.GetNotExistOnSeverBooksId(dtoIds);
            List<object> addedOjbects = new List<object>();
            List<object> deletedOjbects = new List<object>();


            if (deleteIds.Any())
            {
                foreach (Guid id in deleteIds)
                {
                    Book book = await _repo.GetBookByIdAsync(id);
                    await _repo.DeleteBookAsync(book);
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(book.PosterImageUrl), true);
                    deletedOjbects.Add(book.ToBookDto());

                }
            }

            foreach (Guid id in addIds)
            {
                BookDto dto = entities.FirstOrDefault(x => x.Id == id);
                if (dto == null)
                {
                    _logger.LogError($"**i Book with id {id} not found in DTO list");
                    continue;

                }

                Book book = new Book(
                    dto.Title,
                    dto.Description,
                    LanguageList.Languages
                        .Where(x => dto.Languages
                            .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                        .ToList(),
                    dto.AgeGroup,
                    dto.Rating,
                    dto.PublishedDate,
                    dto.StreamUrl,
                    dto.PosterImageUrl
                    );
                book.ChangeId(dto.Id);
                book.ChangeDownloadStatus(DownloadStatus.InQueue);

                foreach (string g in dto.Genres)
                {
                    Genre? genre = await _repo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = await _repo.AddGenreAsync(new Genre(g));
                        genre.AddCategory("story");
                    }
                    book.AddGenre(genre);
                }

                foreach (var w in dto.Writers)
                {
                    Writer? writer = await _repo.GetWriterAsync(w.Name);
                    if (writer == null)
                    {
                        writer = await _repo.AddWriterAsync(new Writer(w.Name));
                    }
                    book.AddWriter(writer);

                }
                book.ChangeDownloadStatus(DownloadStatus.InQueue);
                await _repo.AddBookAsync(book);
                addedOjbects.Add(book.ToBookDto());
            }

            return new DatabaseCategorySyncedResult { Added = addedOjbects, Deleted = deletedOjbects };
        }


        public async Task<DatabaseCategorySyncedResult> SyncPodCastAsync(List<PodCastDto> entities)
        {
            //if (!entities.Any())
            //{
            //    _logger.LogError("Sync PodCast:  PodCast cannot be empty.");
            //    return null;
            //}
            List<Guid> dtoIds = entities.Select(x => x.Id).ToList();
            List<Guid> deleteIds = await _repo.GetNotExistOnSeverPodCastsId(dtoIds);
            List<Guid> addIds = await _repo.GetNotExistPodCastsId(dtoIds);


            List<object> addedOjbects = new List<object>();
            List<object> deletedOjbects = new List<object>();


            if (deleteIds.Any())
            {
                foreach (Guid id in deleteIds)
                {
                    PodCast podCast = await _repo.GetPodCastByIdAsync(id);
                    if (podCast == null) continue;
                    await _repo.DeletePodCastAsync(podCast);
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(podCast.PosterImageUrl), true);
                    deletedOjbects.Add(podCast.ToPodCastDto());

                }
            }

            foreach (Guid id in addIds)
            {
                PodCastDto dto = entities.FirstOrDefault(x => x.Id == id);

                if (dto == null)
                {
                    _logger.LogError($"**i PodCast with id {id} not found in DTO list");
                    continue;
                }


                PodCast podCast = new PodCast(
                   dto.Title,
                   dto.Description,
                   LanguageList.Languages
                       .Where(x => dto.Languages
                           .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                       .ToList(),
                   dto.AgeGroup,
                   dto.PosterImageUrl
               );
                podCast.ChangeId(dto.Id);
                podCast.ChangeDownloadStatus(DownloadStatus.InQueue);
                // Handle Genres
                foreach (string g in dto.Genres)
                {
                    Genre genre = await _repo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = new Genre(g);
                        genre = await _repo.AddGenreAsync(genre);
                    }
                    podCast.Genres.Add(genre);
                }
                // Handle Speakers
                foreach (var s in dto.Speakers)
                {
                    Speaker speaker = await _repo.GetSpeakerAsync(s.Name);
                    if (speaker == null)
                    {
                        speaker = new Speaker(s.Name);
                        speaker = await _repo.AddSpeakerAsync(speaker);
                    }
                    podCast.Speakers.Add(speaker);
                }

                if (!dto.Episodes.Any())
                {
                    podCast.ChangeDownloadStatus(DownloadStatus.Completed);
                    await _repo.AddPodCastAsync(podCast);
                    addedOjbects.Add(podCast.ToPodCastDto());
                    continue;
                }

                foreach (var epDto in dto.Episodes)
                {
                    PodCastEpisode episode = new PodCastEpisode(epDto.Title, epDto.StreamUrl);

                    episode.ChangeId(epDto.Id);
                    episode.ChangeDownloadStatus(DownloadStatus.InQueue);
                    podCast.AddEpisode(episode);
                }



                await _repo.AddPodCastAsync(podCast);
                addedOjbects.Add(podCast.ToPodCastDto());
            }
            return new DatabaseCategorySyncedResult { Added = addedOjbects, Deleted = deletedOjbects };

        }
    }
}
