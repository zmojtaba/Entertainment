
import { IRefrenceData } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";

export const getGenreMovieList = () => {
    return api.get<IRefrenceData>('video/refrence-data')
}

export const deleteMovieResource = (genreName: string) => {
    return api.delete(`genre/${genreName}/video`)
}

// -------------------------Add genre----------------------------------
export const AddGenerList = (generList: string[]) => {
    const data = { genres: generList.map(g => g) }
    console.log("data", data);

    return api.post(`genre/video`, data)
}
