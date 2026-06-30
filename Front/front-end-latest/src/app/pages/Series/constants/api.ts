import { API_CONFIG } from "app/app-configs/apiConfig";
import { registerAxiosInstance } from "app/services/axios/instance";
import axios from "axios";
import { formatBytes } from "./utils";
import { DataRefrence, ISeasons, ISeries } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";

export const hostOrigin = API_CONFIG.plateDetection
const instance = axios.create({
    baseURL: `${API_CONFIG.plateDetection}/api/`
})

registerAxiosInstance(instance)

export const getMovieList = () => {
    return api.get<ISeries[]>('video/series')
}

export const uploadVideo = (movie: ISeries, file: File, onProgress) => {
    // console.log('currentError : ', JSON.stringify(movie.genres.map(g => g.title)))
    const formData = new FormData();
    // formData.append('video', file);
    formData.append('Title', movie.title);
    formData.append('Description', movie.description);
    // formData.append('Countries', JSON.str(movie.countries));
    formData.append('AgeGroup', movie.ageGroup);
    formData.append('ImdbRating', movie.imdbRating);
    formData.append('PublishedDate', movie?.publishedDate!);
    formData.append('PosterImageFile', file);

    movie?.countries?.map(m => {
        formData.append("Countries", m);
    })
    movie?.actors?.map(m => {
        formData.append("Directors", m.name ?? m);
    })
    movie?.actors?.map(m => {
        formData.append("Actors", m.name ?? m);
    })
    movie?.languages?.map(m => {
        formData.append("Languages", m);
    })
    movie?.genres?.map(m => {
        formData.append("Genres", m);
    })

    return api.post<ISeries>(`video/series`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress(progressEvent) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                onProgress?.(`${formatBytes(progressEvent.loaded)} / ${formatBytes(progressEvent.total)}`);

            },
        }
    )
}

export const updateVideo = (movie: ISeries, file: File) => {
    const formData = new FormData();
    let mapped = {
        title: movie.title,
        id: movie.id,
        description: movie.description,
        ageGroup: movie.ageGroup,
        imdbRating: movie.imdbRating,
        publishedDate: movie.publishedDate,
        languages: movie?.languages?.map(m => m),
        countries: movie?.countries?.map(m => m),
        genres: movie?.genres?.map(m => m),
        directors: movie?.directors?.map(m => m.name ?? m),
        actors: movie?.directors?.map(m => m.name ?? m),
    }

    return api.put<ISeries>(`video/series`, mapped)
}

export const getGenerList = () => {
    return api.get(`geners`)
}
export const getMovieRefrenceData = (categoryName: string) => {
    // const data = { categoryName: categoryName }
    return api.get<DataRefrence>(`video/refrence-data`)
}
export const AddGenerList = (generList: string[]) => {
    const data = { generList: generList }
    return api.post(`video/newGener`, data)
}
export const AddSeason = (seasonId: string) => {
    // const data: ISeasons = {
    //     id: '',
    //     seasonNumber: 0,
    //     // episodes: [{ id: '', episodeNumber: '', streamUrl: '' }],
    // }
    // const data = { seasonId: seasonId }
    return api.post(`video/series/season`)
}

export const uploadVideoSeries = (file: File, series: ISeries, subtitle: File, onProgress) => {
    // console.log("Man __________series", series);
    // console.log("Man", series?.seasons.at(-1)?.episodes.at(1)?.episodeNumber ? series?.seasons.at(-1)?.episodes.at(1)?.episodeNumber! + 1 : 1);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('subtitle', subtitle);
    formData.append('SeriesId', series?.id);
    formData.append('SeasonNumber', JSON.stringify((series?.seasons?.at(-1)?.seasonNumber! ? series?.seasons?.at(-1)?.seasonNumber! + 1 : 1)));
    formData.append('EpisodeNumber', JSON.stringify(1))

    return api.post<ISeasons>(`video/series/season`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress(progressEvent) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                onProgress?.(`${formatBytes(progressEvent.loaded)} / ${formatBytes(progressEvent.total)}`);

            },
        }
    )
}
export const AddEpisoda = (file: File, series: ISeries, season: ISeasons, subtitle, onProgress) => {
    // console.log("MaWWWWWWWWWWWWWWWWWWWWWWWWWWWWWn", season?.episodes?.at(-1)?.episodeNumber);
    // console.log("Man", series?.seasons.at(-1)?.episodes.at(1)?.episodeNumber ? series?.seasons.at(-1)?.episodes.at(1)?.episodeNumber! + 1 : 1);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('subtitle', subtitle);
    formData.append('SeriesId', series?.id);
    formData.append('SeasonNumber', JSON.stringify(season.seasonNumber));
    formData.append('EpisodeNumber', JSON.stringify(season?.episodes?.at(-1)?.episodeNumber ? season?.episodes?.at(-1)?.episodeNumber! + 1 : 1))

    return api.post<ISeasons>(`video/series/season`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress(progressEvent) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                onProgress?.(`${formatBytes(progressEvent.loaded)} / ${formatBytes(progressEvent.total)}`);

            },
        }
    )
}

export const deleteEpizod = (seasonId: string, episodId: string) => {
    return api.delete(`video/seires/episode/${episodId}`)
}
export const deleteSeasonApi = (seasonId: string) => {
    return api.delete(`video/series/season/${seasonId}`)
}
export const deleteSeriesApi = (seasonId: string) => {
    return api.delete(`video/series/${seasonId}`)
}