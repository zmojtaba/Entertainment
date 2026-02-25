import axios from "axios";
import { API_CONFIG } from "./ApiConfig";
import type { Genre, Movie } from "./types";

const hostOrigin = API_CONFIG.movie;
const instance = axios.create({
    baseURL: `${hostOrigin}/api/`
})


export const getMovies = (language: string, gener: string) => {
    return instance.get<Movie[]>('/video/movie', {
        params: {
            language: language,
            gener: gener
        }
    })
}
export const filterByGenres = (language: string, gener: string) => {
    return instance.get<Movie[]>('/video/movie', {
        params: {
            language: language,
            gener: gener
        }
    })
}
export const getGeners = () => {
    return instance.get<Genre>('video/refrence-data')
}

export const getMoviesByID = (id: string) => {
    return instance.get<Movie>(`video/movie/${id}`)
}
