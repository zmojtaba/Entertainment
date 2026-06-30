import { formatBytes } from "./utils";
import { DataRefrence,ISeries } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";

export const getMovieList = () => {
    return api.get<ISeries[]>('story/podcast')
}

export const uploadVideo = (album: ISeries, poster: File, onProgress) => {
    const formData = new FormData();
    formData.append('PosterImageFile', poster);
    formData.append("Title", album.title);
    formData.append("Description", album.description);
    formData.append("AgeGroup", album.ageGroup);
    album?.languages?.map(m => {
        formData.append("Languages", m);
    })
    album?.genres?.map(m => {
        formData.append("Genres",  m);
    })
    album?.genres?.map(m => {
        formData.append("speakers",  m);
    })

    return api.post<ISeries>(`story/podcast`, formData,
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

export const uploadImage = (movieId: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file[0]);
    formData.append('id', movieId);

    return api.post<ISeries>(`image/upload`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }
    )
}

export const updateVideo = (album: ISeries, poster: File) => {

    const formData = new FormData();
    formData.append('Id', album.id);
    formData.append('PosterImageFile', poster);
    formData.append("Title", album.title);
    formData.append("Description", album.description);
    formData.append("AgeGroup", album.ageGroup);
    album?.languages?.map(m => {
        formData.append("Languages", m);
    })
    album?.genres?.map(m => {
        formData.append("Genres",  m);
    })
    album?.genres?.map(m => {
        formData.append("speakers", m);
    })
    return api.put<ISeries>(`story/podcast`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }
    )
}

export const getMovieRefrenceData = (categoryName: string) => {
    const data = { categoryName: categoryName }
    return api.get<DataRefrence>(`story/refrence-data`)
}
export const AddGenerList = (generList: string[]) => {
    const data = { generList: generList }
    return api.post(`video/newGener`, data)
}
export const AddSeason = (seasonId: string) => {
    const data = { seasonId: seasonId }
    return api.post(`video/series/add-season`, data)
}

export const uploadVideoSeries = (poster: File, album: ISeries, onProgress) => {
    const formData = new FormData();
    formData.append('SeriesId', album.id);
    formData.append("Title", poster?.name);
    formData.append('audio', poster);
    return api.post<ISeries>(`story/podcast/episode`, formData,
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

export const deleteEpizodApi = (episodId: string) => {
    return api.delete(`story/podcast/episode/${episodId}`)
}
export const deleteSeasonApi = (seasonId: string) => {  
    return api.delete(`story/podcast/${seasonId}`)
}

// ------------------------------------------------
export const getGenerList = () => {
    return api.get(`geners`)
}