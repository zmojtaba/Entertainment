

export interface ICrew {
    id: string,
    title: string,
    country: string,
    city: string
}
export type DataStoreState = {
    movieList: ICrew[];
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
    showSearchList(movie: ICrew[]): void;
    loadMovieList(): void;
    deleteMovie(movie: ICrew): void;
    insertMovie(movie: ICrew): void;
    setLoadingMsg(loading: string): void;
    clearStore(): void;
}

export type DataStoreType = DataStoreState & DataStoreReducers