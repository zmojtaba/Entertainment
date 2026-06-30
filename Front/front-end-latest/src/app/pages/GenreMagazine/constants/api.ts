
import {  IRefrenceData } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";

export const getGenreMovieList = () => {
    return api.get<IRefrenceData>('publication/refrence-data')
}

export const deleteMovieResource = (genreName: string) => {
    return api.delete(`genre/${genreName}/publication`)
}

// -------------------------Add genre----------------------------------
export const AddGenerList = (generList: string[]) => {
    const data = { genres: generList.map(g => g) }
   return api.post(`genre/publication`, data)
}
