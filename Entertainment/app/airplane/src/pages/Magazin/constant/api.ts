import axios from "axios";
import { API_CONFIG } from "@/constants/ApiConfig";
import type { Genre } from "@/store/types";
import type { IMagazin } from "../types";

const hostOrigin = API_CONFIG.movie;
const instance = axios.create({
    baseURL: `${hostOrigin}/api/`
})


export const getMovies = (language: string, gener: string) => {
    return instance.get<IMagazin[]>('publication/magazine', {
        params: {
            language: language,
            gener: gener
        }
    })
}
export const filterByGenres = (language: string, gener: string) => {
    return instance.get<IMagazin[]>('publication/magazine', {
        params: {
            language: language,
            gener: gener
        }
    })
}
export const getGeners = () => {
    return instance.get<Genre>('publication/refrence-data')
}

export const getMoviesByID = (id: string) => {
    return instance.get<IMagazin>(`publication/magazines/${id}`)
}
