namespace EntertainmentApp.Application.Services.DatabaseSync
{
    public class VideoDatabaseSync : IVideoDatabaseSync
    {
        private readonly IMovieRepository _movieRepo;
        private readonly ISeriesRepository _seriesRepo;
        private readonly IMediaService _mediaService;
        private readonly ILogger<VideoDatabaseSync> _logger;
        public VideoDatabaseSync(IMovieRepository movieRepo, IMediaService mediaService, ILogger<VideoDatabaseSync> logger, ISeriesRepository seriesRepo)
        {
            _movieRepo = movieRepo;
            _mediaService = mediaService;
            _logger = logger;
            _seriesRepo = seriesRepo;
        }
        public async Task<DatabaseCategorySyncedResult> SyncMovieAsync(List<MovieDto> movies)
        {

            //if (!movies.Any())
            //{
            //    _logger.LogError("Sync Movie:  Movies cannot be empty.");
            //    return null;
            //}
            List<Guid> dtoIds = movies.Select(x => x.Id).ToList();
            List<Guid> addIds = await _movieRepo.GetNotExistMoviesId(dtoIds);
            List<Guid> deleteIds = await _movieRepo.GetNotExistOnSeverMoviesId(dtoIds);
            List<object> addedOjbects = new List<object>();
            List<object> deletedOjbects = new List<object>();


            if (deleteIds.Any())
            {
                foreach (Guid id in deleteIds)
                {
                    Movie movie = await _movieRepo.GetMovieByIdAsync(id);
                    await _movieRepo.DeleteMovieAsync(movie);
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(movie.PosterImageUrl), true);
                    deletedOjbects.Add(movie.ToMoveDto());

                }
            }

            foreach (Guid id in addIds)
            {
                MovieDto dto = movies.FirstOrDefault(x => x.Id == id);
                if (dto == null)
                {
                    _logger.LogError($"**i Movie with id {id} not found in DTO list");
                    continue;

                }

                Movie movie = new Movie(
                    dto.Title,
                    dto.Description,
                    LanguageList.Languages
                        .Where(x => dto.Languages
                            .Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                        .ToList(),
                    CountryList.Countries
                    .Where(x => dto.Countries
                        .Any(c => c.Equals(x, StringComparison.OrdinalIgnoreCase))).ToList(),
                    dto.AgeGroup,
                    dto.ImdbRating,
                    dto.PublishedDate,
                    dto.StreamUrl,
                    dto.PosterImageUrl,
                    dto.SubtitleUrl
                    );
                movie.ChangeId(dto.Id);
                movie.ChangeDownloadStatus(DownloadStatus.InQueue);


                foreach (string g in dto.Genres)
                {
                    Genre? genre = await _movieRepo.GetGenreAsync(g);
                    if (genre == null)
                    {
                        genre = await _movieRepo.AddGenreAsync(new Genre(g));
                        genre.AddCategory("video");

                    }
                    movie.AddGenre(genre);
                }

                // 5. Add directors
                foreach (DirectorDto d in dto.Directors)
                {
                    Director? director = await _movieRepo.GetDirectorAsync(d.Name);
                    if (director == null) director = await _movieRepo.AddDirectorAsync(new Director(d.Name));
                    movie.AddDirector(director);
                }

                // 6. Add actors
                foreach (ActorDto a in dto.Actors)
                {
                    Actor? actor = await _movieRepo.GetActorAsync(a.Name);
                    if (actor == null) actor = await _movieRepo.AddActorAsync(new Actor(a.Name));
                    movie.AddActor(actor);

                }
                movie.ChangeDownloadStatus(DownloadStatus.InQueue);
                await _movieRepo.AddMovieAsync(movie);
                addedOjbects.Add(movie.ToMoveDto());
            }

            return new DatabaseCategorySyncedResult { Added = addedOjbects, Deleted = deletedOjbects };
        }

        public async Task<DatabaseCategorySyncedResult> SyncSeriesAsync(List<SeriesDto> seriesList)
        {
            //if (!seriesList.Any())
            //{
            //    _logger.LogError("Sync Series:  Series cannot be empty.");
            //    return null;
            //}
            List<Guid> dtoIds = seriesList.Select(x => x.Id).ToList();
            List<Guid> deleteIds = await _seriesRepo.GetNotExistOnSeverSeriesId(dtoIds);
            List<Guid> addIds = await _seriesRepo.GetNotExistSeriesId(dtoIds);


            List<object> addedOjbects = new List<object>();
            List<object> deletedOjbects = new List<object>();


            if (deleteIds.Any())
            {
                foreach (Guid id in deleteIds)
                {
                    Series series = await _seriesRepo.GetSeriesByIdAsync(id);
                    if (series == null) continue;
                    await _seriesRepo.DeleteSeriesAsync(series);
                    await _mediaService.DeleteMediaDirecoryAsync(Path.GetDirectoryName(series.PosterImageUrl), true);
                    deletedOjbects.Add(series.ToSeriesDto());

                }
            }

            foreach (Guid id in addIds)
            {
                SeriesDto dto = seriesList.FirstOrDefault(x => x.Id == id);

                if (dto == null)
                {
                    _logger.LogError($"**i Series with id {id} not found in DTO list");
                    continue;
                }
                Series series = new Series(
                       dto.Title,
                       dto.Description,
                       LanguageList.Languages
                           .Where(x => dto.Languages.Any(l => l.Equals(x, StringComparison.OrdinalIgnoreCase)))
                           .ToList(),
                       CountryList.Countries
                           .Where(x => dto.Countries.Any(c => c.Equals(x, StringComparison.OrdinalIgnoreCase)))
                           .ToList(),
                       dto.AgeGroup,
                       dto.ImdbRating,
                       dto.PublishedDate,
                       dto.PosterImageUrl
                   );
                series.ChangeId(dto.Id);
                series.ChangeDownloadStatus(DownloadStatus.InQueue);

                foreach (string g in dto.Genres)
                {
                    Genre? genre = await _movieRepo.GetGenreAsync(g);

                    if (genre == null)
                    {
                        genre = await _movieRepo.AddGenreAsync(new Genre(g));
                        genre.AddCategory("video");
                    }

                    series.AddGenre(genre);
                }

                foreach (DirectorDto d in dto.Directors)
                {
                    Director? director = await _movieRepo.GetDirectorAsync(d.Name);

                    if (director == null)
                        director = await _movieRepo.AddDirectorAsync(new Director(d.Name));

                    series.AddDirector(director);
                }

                foreach (ActorDto a in dto.Actors)
                {
                    Actor? actor = await _movieRepo.GetActorAsync(a.Name);

                    if (actor == null)
                        actor = await _movieRepo.AddActorAsync(new Actor(a.Name));

                    series.AddActor(actor);
                }

                if (!dto.Seasons.Any())
                {
                    series.ChangeDownloadStatus(DownloadStatus.Completed);
                    await _seriesRepo.AddSeriesAsync(series);
                    addedOjbects.Add(series.ToSeriesDto());
                    continue;
                }

                foreach (SeasonDto seasonDto in dto.Seasons)
                {
                    Season season = new Season(seasonDto.SeasonNumber);
                    season.ChangeId(seasonDto.Id);


                    foreach (var epDto in seasonDto.Episodes)
                    {
                        Episode episode = new Episode(
                                epDto.EpisodeNumber,
                                epDto.StreamUrl,
                                epDto.SubtitleUrl
                            );

                        episode.ChangeId(epDto.Id);
                        episode.ChangeDownloadStatus(DownloadStatus.InQueue);
                        season.AddEpisode(episode);

                    }
                    series.AddSeason(season);
                }



                await _seriesRepo.AddSeriesAsync(series);
                addedOjbects.Add(series.ToSeriesDto());
            }
            return new DatabaseCategorySyncedResult { Added = addedOjbects, Deleted = deletedOjbects };

        }
    }
}
