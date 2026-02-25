import { API_CONFIG } from "app/app-configs/apiConfig";
import { registerAxiosInstance } from "app/services/axios/instance";
import axios from "axios";
import { formatBytes } from "./utils";
import { DataRefrence, IGenersItem, IMagazin } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";

export const hostOrigin = API_CONFIG.plateDetection
const instance = axios.create({
    baseURL: `${API_CONFIG.plateDetection}/api/`
})

registerAxiosInstance(instance)

export const getMovieList = () => {
    return api.get<IMagazin[]>('publication/magazine')
}

export const uploadVideo = (magazine: IMagazin, pdfFile: File, poster: File, onProgress) => {
    const formData = new FormData();
    formData.append('ebook', pdfFile);
    formData.append('poster', poster);
    // formData.append('image', file[0]);
    formData.append("Title", magazine.title);
    formData.append("publisher", magazine.publisher.name);
    formData.append("publisheddate", magazine.publishedDate.toString());
    formData.append("Languages", JSON.stringify(magazine.languages.map(l => l)));
    formData.append("Genres", JSON.stringify(magazine.genres.map(g => g.title)));

    return api.post<IMagazin>(`publication/magazine`, formData,
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
    // const data = { movie: movie }
    // return instance.post<IMagazin>(`publication/magazine`, movie)
    const formData = new FormData();
    // formData.append('ebook', pdfFile);
    formData.append('Id', magazine.id);
    formData.append("Title", magazine.title);
    formData.append("PublishedDate", magazine.publishedDate.toString());
    magazine?.languages?.map(m => {
        formData.append("Languages", m);
    })
    magazine?.genres?.map(m => {
        formData.append("Genres", m.title);
    })
    formData.append('PosterImageFile', poster);
    formData.append("Publisher", magazine.publisher.name);

    return instance.put<IMagazin>(`publication/magazine`, formData,
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
export const getGenerList = () => {
    return api.get(`geners`)
}


export const getMovieRefrenceData = (categoryName: string) => {
    const data = { categoryName: categoryName }
    return api.get<DataRefrence>(`publication/refrence-data`)
}
export const AddGenerList = (generList: IGenersItem[]) => {
    const data = { generList: generList }
    return api.post(`video/newGener`, data)
}

export const deleteMagazinResource = (id: string) => {
    return api.delete(`publication/magazine/${id}`)
}