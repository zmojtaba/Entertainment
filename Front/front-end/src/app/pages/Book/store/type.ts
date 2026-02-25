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
    title: string,
    description: string,
    rating: string,
    publishedDate: number,
    languages: string[],
    language?: string[],
    ageGroup: string,
    streamUrl: string,
    posterImageUrl: string,
    genres: IGenersItem[],
    writers: IDirectors[]
}


export type DataRefrence = {
    genres: IGenersItem[],
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