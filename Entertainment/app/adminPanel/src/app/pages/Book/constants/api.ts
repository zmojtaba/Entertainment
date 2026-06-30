import { API_CONFIG } from "app/app-configs/apiConfig";
import { registerAxiosInstance } from "app/services/axios/instance";
import { IMovie } from "app/services/utils/public_types";
import axios from "axios";
import { formatBytes } from "./utils";
import { DataRefrence, IMagazin } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";

export const getMovieList = () => {
    return api.get<IMagazin[]>('story/book')
}

export const uploadVideo = (magazine: IMagazin, pdfFile: File, poster: File, onProgress) => {
    const formData = new FormData();
    formData.append('ebook', pdfFile);
    formData.append('poster', poster);
    // formData.append('image', file[0]);
    formData.append("Title", magazine.title);
    formData.append("Description", magazine.description);
    formData.append("publisheddate", magazine.publishedDate.toString());
    formData.append("AgeGroup", magazine.ageGroup);
    formData.append("Rating", magazine.rating);
    formData.append("Languages", JSON.stringify(magazine?.languages?.map(l => l)));
    formData.append("Genres", JSON.stringify(magazine.genres.map(g => g)));
    formData.append("Writers", JSON.stringify(magazine.writers.map(g => g.name)));

    return api.post<IMagazin>(`story/book`, formData,
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
export const updateVideo = (magazine: IMagazin) => {
    // const formData = new FormData();
    // formData.append('poster', poster);

    const data = {
        id: magazine.id,
        title: magazine.title,
        description: magazine.description,
        languages: magazine?.languages?.map(l => l),
        ageGroup: magazine.ageGroup,
        rating: magazine.rating,
        publishedDate: magazine.publishedDate.toString(),
        genres: magazine.genres.map(g=>g),
        writers: magazine.writers.map(g => g.name ?? g),
    }

    return api.put<IMagazin>(`story/book`, data)
}

export const getMovieRefrenceData = (categoryName: string) => {
    const data = { categoryName: categoryName }
    return api.get<DataRefrence>(`story/refrence-data`)
}

export const deleteMagazinResource = (id: string) => {
    return api.delete(`rtsp/delete/${id}`)
}
// ---------------------------------------------------------------------------
export const AddGenerList = (generList: string[]) => {
    const data = { generList: generList }
    return api.post(`video/newGener`, data)
}
export const getGenerList = () => {
    return api.get(`geners`)
}