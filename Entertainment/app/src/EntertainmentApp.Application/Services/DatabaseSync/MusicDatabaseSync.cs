namespace EntertainmentApp.Application.Services.DatabaseSync
{
    public class MusicDatabaseSync : IMusicDatabaseSync
    {
        private readonly IMusicRepository _musicRepo;
        private readonly IMediaService _mediaService;
        private readonly ILogger<MusicDatabaseSync> _logger;
        public MusicDatabaseSync(IMediaService mediaService, ILogger<MusicDatabaseSync> logger, IMusicRepository musicRepo)
        {
            _mediaService = mediaService;
            _logger = logger;
            _musicRepo = musicRepo;
        }


        public async Task<DatabaseCategorySyncedResult> SyncTrackAsync(List<TrackDto> tracks)
        {

            //if (!tracks.Any())
            //{
            //    _logger.LogError("Sync Track:  Tracks cannot be empty.");
            //    return null;
            //}
            List<Guid> dtoIds = tracks.Select(x => x.Id).ToList();
            List<Guid> addIds = await _musicRepo.GetNotExistTracksId(dtoIds);
            List<Guid> deleteIds = await _musicRepo.GetNotExistOnSeverTracksId(dtoIds);
            List<object> addedOjbects = new List<object>();
            List<object> deletedOjbects = new List<object>();


            if (deleteIds.Any())
            {
                foreach (Guid id in deleteIds)
                {
                    Track track = await _musicRepo.GetTrackByIdAsync(id);
                    await _musicRepo.DeleteTrackAsync(track);
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(track.PosterImageUrl), true);
                    deletedOjbects.Add(track.ToTrackDto());

                }
            }

            foreach (Guid id in addIds)
            {
                TrackDto dto = tracks.FirstOrDefault(x => x.Id == id);
                if (dto == null)
                {
                    _logger.LogError($"**i Track with id {id} not found in DTO list");
                    continue;

                }

                Track track = new Track(
                    dto.Title,
                    LanguageList.Languages
                        .Where(x => dto.Languages
                            .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                        .ToList(),
                    dto.StreamUrl,
                    dto.PosterImageUrl
                    );
                track.ChangeId(dto.Id);
                track.ChangeDownloadStatus(DownloadStatus.InQueue);

                foreach (string g in dto.Genres)
                {
                    Genre? genre = await _musicRepo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = await _musicRepo.AddGenreAsync(new Genre(g));
                        genre.AddCategory("music");
                    }
                    track.AddGenre(genre);
                }

                Singer? singer = await _musicRepo.GetSingerAsync(dto.Singer.Name);
                if (singer == null)
                {
                    singer = await _musicRepo.AddSingerAsync(new Singer(dto.Singer.Name));
                }
                track.SetSinger(singer);
                track.ChangeDownloadStatus(DownloadStatus.InQueue);
                await _musicRepo.AddTrackAsync(track);
                addedOjbects.Add(track.ToTrackDto());
            }

            return new DatabaseCategorySyncedResult { Added = addedOjbects, Deleted = deletedOjbects };
        }

        public async Task<DatabaseCategorySyncedResult> SyncAlbumAsync(List<AlbumDto> albums)
        {
            //if (!albums.Any())
            //{
            //    _logger.LogError("Sync Album:  Albums cannot be empty.");
            //    return null;
            //}
            List<Guid> dtoIds = albums.Select(x => x.Id).ToList();
            List<Guid> deleteIds = await _musicRepo.GetNotExistOnSeverAlbumsId(dtoIds);
            List<Guid> addIds = await _musicRepo.GetNotExistAlbumsId(dtoIds);


            List<object> addedOjbects = new List<object>();
            List<object> deletedOjbects = new List<object>();


            if (deleteIds.Any())
            {
                foreach (Guid id in deleteIds)
                {
                    Album album = await _musicRepo.GetAlbumByIdAsync(id);
                    if (album == null) continue;
                    await _musicRepo.DeleteAlbumAsync(album);
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(album.PosterImageUrl), true);
                    deletedOjbects.Add(album.ToAlbumDto());

                }
            }

            foreach (Guid id in addIds)
            {
                AlbumDto dto = albums.FirstOrDefault(x => x.Id == id);

                if (dto == null)
                {
                    _logger.LogError($"**i album with id {id} not found in DTO list");
                    continue;
                }
                Album album = new Album(
                    dto.Title,
                    LanguageList.Languages
                        .Where(x => dto.Languages
                            .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                        .ToList(),
                    dto.PosterImageUrl
                );
                album.ChangeId(dto.Id);
                album.ChangeDownloadStatus(DownloadStatus.InQueue);
                // Handle Genres
                foreach (string g in dto.Genres)
                {
                    Genre genre = await _musicRepo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = new Genre(g);
                        genre = await _musicRepo.AddGenreAsync(genre);
                    }
                    album.Genres.Add(genre);
                }
                // Handle Speakers
                Singer? singer = await _musicRepo.GetSingerAsync(dto.Singer.Name);
                if (singer == null)
                {
                    singer = await _musicRepo.AddSingerAsync(new Singer(dto.Singer.Name));
                }
                album.SetSinger(singer);

                if (!dto.Episodes.Any())
                {
                    album.ChangeDownloadStatus(DownloadStatus.Completed);
                    await _musicRepo.AddAlbumAsync(album);
                    addedOjbects.Add(album.ToAlbumDto());
                    continue;
                }

                foreach (var epDto in dto.Episodes)
                {
                    AlbumEpisode episode = new AlbumEpisode(epDto.Title, epDto.StreamUrl);

                    episode.ChangeId(epDto.Id);
                    episode.ChangeDownloadStatus(DownloadStatus.InQueue);
                    album.AddEpisode(episode);
                }



                await _musicRepo.AddAlbumAsync(album);
                addedOjbects.Add(album.ToAlbumDto());
            }
            return new DatabaseCategorySyncedResult { Added = addedOjbects, Deleted = deletedOjbects };

        }

    }
}
