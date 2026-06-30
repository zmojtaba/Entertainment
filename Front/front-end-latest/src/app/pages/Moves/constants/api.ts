import { API_CONFIG } from "app/app-configs/apiConfig";
import { registerAxiosInstance } from "app/services/axios/instance";
import { IMovie } from "app/services/utils/public_types";
import axios from "axios";
import { formatBytes } from "./utils";
import { DataRefrence } from "../store/type";
import api from "app/shared-components/Api/axiosInstance";

export const hostOrigin = API_CONFIG.plateDetection
const instance = axios.create({
    baseURL: `${API_CONFIG.plateDetection}/api/`
})

// registerAxiosInstance(instance)

export const getMovieList = () => {
    return api.get<IMovie[]>('video/movie')
}


// -----------------------------------
export const uploadVideo = (movie: IMovie, file: File, poster: File,subtitle:File, onProgress) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('subtitle', subtitle);
    formData.append('poster', poster);
    formData.append('Title', movie?.title);
    formData.append('Description', movie?.description);
    formData.append('PublishedDate', movie?.publishedDate!);
    formData.append('AgeGroup', movie?.ageGroup);
    formData.append('ImdbRating', movie?.imdbRating);
    formData.append('Languages', JSON.stringify(movie?.languages.map(l => l)));
    formData.append('Countries', JSON.stringify(movie?.countries.map(l => l)));
    formData.append('Actors', JSON.stringify(movie?.actors.map(l => l.name)));
    formData.append('Genres', JSON.stringify(movie?.genres.map(l => l)));
    formData.append('Directors', JSON.stringify(movie?.directors.map(l => l.name)));


    return api.post<IMovie>(`video/movie`, formData,
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
export const deleteMovieResource = (id: string) => {
    return api.delete(`video/movie/${id}`)
}

export const updateVideo = (movie: IMovie) => {
    // const data = {
    //     movie
    // }
    // console.log("data", movie);
    const mapped = {
        id: movie.id,
        title: movie.title,
        description: movie.description,
        languages: movie.languages.map(l => l),
        countries: movie.countries.map(c => c),
        ageGroup: movie.ageGroup,
        imdbRating: movie.imdbRating,
        publishedDate: movie.publishedDate!,
        genres: movie.genres.map(g => g),
        directors: movie.directors.map(g => g.name ?? g),
        actors: movie.directors.map(g => g.name ?? g)
    }

    return api.put<IMovie>(`video/movie`, mapped)
}

export const getGenerList = () => {
    return api.get(`geners`)
}
export const getMovieRefrenceData = (categoryName: string) => {
    const data = { categoryName: categoryName }
    return api.get<DataRefrence>(`video/refrence-data`)
}
export const AddGenerList = (generList: string[]) => {
    const data = { genres: generList.map(i=>i) }
    console.log('geners',data)
    return api.post(`genre/movie`, data)
}