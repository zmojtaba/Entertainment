

export interface IRefrenceData {
    genres: string[]
}

export type DataStoreState = {
    genreList:string[],
    loadingMsg: string;
    errorLoadingMovies: boolean;
    loadingMovieList: boolean;
}

export type DataStoreReducers = {
    loadMovieList(): void;
    insertMovie(genre: string[]): void;
    deleteMovie(genre: string): void;
    setLoadingMsg(loading: string): void;
    clearStore(): void;
}

export type DataStoreType = DataStoreState & DataStoreReducers