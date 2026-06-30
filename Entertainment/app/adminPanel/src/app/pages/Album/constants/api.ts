import { formatBytes } from "./utils";
import { DataRefrence,  ISeries } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";



export const getMovieList = () => {
    return api.get<ISeries[]>('music/album')
}


export const uploadVideo = (album: ISeries, poster: File, onProgress) => {
    const formData = new FormData();
    formData.append('PosterImageFile', poster);
    // formData.append('image', file[0]);
    formData.append("Title", album.title);
    // formData.append("Languages", JSON.stringify(album.languages.map(l => l)));
    // formData.append("Genres", JSON.stringify(album.genres.map(g => g.title ?? g)));
    formData.append("singer", album.singer.name);


    album?.languages?.map(m => {
        formData.append("Languages", m);
    })
    album?.genres?.map(m => {
        formData.append("Genres",m);
    })

    return api.post<ISeries>(`music/album`, formData,
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
export const EditAlbum = (album: ISeries, poster: File) => {
    const formData = new FormData();
    formData.append('PosterImageFile', poster);
    formData.append('Id', album.id);
    formData.append("Title", album.title);
    // formData.append("Languages", JSON.stringify(album.languages.map(l => l)));
    // formData.append("Genres", JSON.stringify(album.genres.map(g => g.title ?? g)));
    formData.append("singer", album.singer.name);

    album?.languages?.map(m => {
        formData.append("Languages", m);
    })
    album?.genres?.map(m => {
        formData.append("Genres", m);
    })

    return api.put<ISeries>(`music/album`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }
    )
}

export const updateVideo = (movie: ISeries) => {
    const data = { movie: movie }
    return api.post<ISeries>(`video/update`, data)
}


export const getMovieRefrenceData = (categoryName: string) => {
    const data = { categoryName: categoryName }
    return api.get<DataRefrence>(`music/refrence-data`)
}

export const AddSeason = (seasonId: string) => {
    const data = { seasonId: seasonId }
    return api.post(`video/series/add-season`, data)
}

export const uploadVideoSeries = (file: File, season: ISeries, onProgress) => {
    const formData = new FormData();
    console.log("season.id", season)
    formData.append('SeriesId', season.id);
    formData.append('audio', file);
    formData.append('Title', file.name);

    return api.post<ISeries>(`/music/album/episode`, formData,
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
    return api.delete(`music/album/episode/${episodId}`)
}

export const deleteSeasonApi = (seasonId: string) => {
    const data = {
        seasonId: seasonId
    }
    return api.delete(`music/album/${seasonId}`)
}

// -----------------------------------------
export const getGenerList = () => {
    return api.get(`geners`)
}

export const AddGenerList = (generList: string[]) => {
    const data = { generList: generList }
    return api.post(`video/newGener`, data)
}