// import { IDirectors, IMovie } from "app/services/utils/public_types";
export interface IGenersItem {
    title: string
}

export interface IDirectors {
    name: string,
    imagePath?: string
}
export interface IMagazin {
    id: string,
    username: string,
    role: string,
    refreshToken: string,
    password?: string
    confirmPassword?: string
}


export type DataRefrence = {
    genres: IGenersItem[],
    actors: IDirectors[],
    directores: IDirectors[],
    languages: string[],
    countries: string[]
}

export type DataStoreState = {
    movieList: IMagazin[];
    loadingMsg: string;
    errorLoadingMovies: boolean;
    loadingMovieList: boolean;
}
export type Progress = {
    percent: string,
    formatted: string,
    loaded: string,
    total: string,
    completed: boolean,
}

export type DataStoreReducers = {
    loadMovieList(): void;
    deleteMovie(movie: IMagazin): void;
    insertMovie(movie: IMagazin): void;
    setLoadingMsg(loading: string): void;
    clearStore(): void;
}

export type DataStoreType = DataStoreState & DataStoreReducers