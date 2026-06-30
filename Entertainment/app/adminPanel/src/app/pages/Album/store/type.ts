import { IDirectors } from "app/services/utils/public_types";

export interface IEpisodes {
  id: string,
  title: number,
  streamUrl: string
}
export interface ISeasons {
  id: string,
  seasonNumber: number,
  episodes: IEpisodes[]
}
export interface ISeries {
  id: string,
  title: string,
  languages: string[],
  posterImageUrl: string,
  genres: string[],
  singer: IDirectors,
  episodes: IEpisodes[]
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
  movieList: ISeries[];
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
  deleteMovie(movie: ISeries): void;
  deleteEpisod(episodId: string): void;
  deleteSeason(seasons: string): void;
  insertMovie(movie: ISeries): void;
  setLoadingMsg(loading: string): void;
  clearStore(): void;
}

export type DataStoreType = DataStoreState & DataStoreReducers