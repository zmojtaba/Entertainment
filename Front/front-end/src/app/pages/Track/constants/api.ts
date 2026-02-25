import { API_CONFIG } from "app/app-configs/apiConfig";
import { registerAxiosInstance } from "app/services/axios/instance";
import { IMovie } from "app/services/utils/public_types";
import axios from "axios";
import { formatBytes } from "./utils";
import { DataRefrence, IGenersItem, IMagazin } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";



export const getMovieList = () => {
    return api.get<IMagazin[]>('music/track')
}

export const uploadVideo = (magazine: IMagazin, pdfFile: File, poster: File, onProgress) => {
    const formData = new FormData();
    formData.append('audio', pdfFile);
    formData.append('poster', poster);
    // formData.append('image', file[0]);
    formData.append("Title", magazine.title);
    formData.append("singer", magazine.singer.name);
    formData.append("Languages", JSON.stringify(magazine.language.map(l => l)));
    formData.append("Genres", JSON.stringify(magazine.genres.map(g => g.title)));

    return api.post<IMagazin>(`music/track`, formData,
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
export const updateVideo = (magazine: IMagazin, poster: File, onProgress) => {
    const formData = new FormData();
    formData.append("Id", magazine.id);
    formData.append("Title", magazine.title);

    // formData.append("Languages", JSON.stringify(magazine.language.map(l => l)));
    formData.append('PosterImageFile', poster);
    // formData.append('image', file[0]);
    // formData.append("Genres", JSON.stringify(magazine.genres.map(g => g.title)));
    formData.append("Singer", magazine.singer.name);

    magazine?.language?.map(m => {
        formData.append("Languages", m);
    })
    magazine?.genres?.map(m => {
        formData.append("Genres", m.title ?? m);
    })

    return api.put<IMagazin>(`music/track`, formData,
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

export const getMovieRefrenceData = (categoryName: string) => {
    const data = { categoryName: categoryName }
    return api.get<DataRefrence>(`music/refrence-data`)
}

export const deleteResource = (id: string) => {
    return api.delete(`music/track/${id}`)
}
// --------------------------------
export const AddGenerList = (generList: IGenersItem[]) => {
    const data = { generList: generList }
    return api.post(`video/newGener`, data)
}
export const getGenerList = () => {
    return api.get(`geners`)
}