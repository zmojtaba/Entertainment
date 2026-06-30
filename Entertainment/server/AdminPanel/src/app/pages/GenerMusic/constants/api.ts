
import { IGenersItem, IRefrenceData } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";

export const getGenreMovieList = () => {
    return api.get<IRefrenceData>('music/refrence-data')
}

export const deleteMovieResource = (genreName: string) => {
   return api.delete(`genre/${genreName}/music`)
}

// -------------------------Add genre----------------------------------
export const AddGenerList = (generList: IGenersItem[]) => {
    const data = { genres: generList.map(g => g.title) }
     return api.post(`genre/music`, data)
}
