import { API_CONFIG } from "app/app-configs/apiConfig";
import { registerAxiosInstance } from "app/services/axios/instance";
import { IMovie } from "app/services/utils/public_types";
import axios from "axios";
import { formatBytes } from "./utils";
import { ICrew } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";



export const getMovieList = () => {
    return api.get<ICrew[]>('coru')
}

export const getMovieRefrenceData = (categoryName: string) => {
    const data = { categoryName: categoryName }
    return api.post<string[]>(`coru/refrence-data`, data)
}

export const uploadVideo = (movie: ICrew, file: File, onProgress) => {
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('Title', movie?.title);
    formData.append('Country', movie?.country);
    formData.append('City', movie?.city!);

    return api.post<ICrew>(`coru`, formData,
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

export const updateVideo = (movie: ICrew, file: File) => {
    const formData = new FormData();
    if (file)
        formData.append('audio', file);
    formData.append('Title', movie?.title);
    formData.append('Country', movie?.country);
    formData.append('City', movie?.city!);

    return api.put<ICrew>(`coru`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )
}

export const deleteMovieResource = (id: string) => {
    return api.delete(`coru/${id}`)
}
export const playAudioApi = (id: string) => {
    return api.get(`coru/play/${id}`)
}
export const stopAudioApi = (id: string) => {
    return api.get(`coru/stop/${id}`)
}
export const SearchItemResource = (country: string, city: string) => {
    const data = {
        country: country,
        city: city
    }
    // return api.post<ICrew[]>(`coru/search`, data)
     return api.get<ICrew[]>('coru')
}