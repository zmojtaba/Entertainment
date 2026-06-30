import { IDirectors, IMovie } from "app/services/utils/public_types";


export type DataRefrence = {
    genres: string[],
    actors: IDirectors[],
    directores: IDirectors[],
    languages: string[],
    countries: string[]
}
export type DataStoreState = {
    movieRefrenceData: DataRefrence | null,
    movieList: IMovie[];
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
    deleteMovie(movie: IMovie): void;
    insertMovie(movie: IMovie): void;
    setLoadingMsg(loading: string): void;
    clearStore(): void;
}

export type DataStoreType = DataStoreState & DataStoreReducers