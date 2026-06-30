// import { IDirectors, IMovie } from "app/services/utils/public_types";

export interface IDirectors {
    name: string,
    imagePath?: string
}
export interface IMagazin {
    id: string,
    title: string,
    languages: string[],
    publishedDate: number,
    streamUrl: string,
    genres: string[],
    posterImageUrl: string,
    publisher: IDirectors
}


export type DataRefrence = {
    genres: string[],
    actors: IDirectors[],
    directores: IDirectors[],
    languages: string[],
    countries: string[]
}

export type DataStoreState = {
    movieRefrenceData: DataRefrence | null,
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