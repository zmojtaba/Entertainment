import { IDirectors } from "app/services/utils/public_types";



export interface IEpisodes {
  id: string,
  episodeNumber: number,
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
  description: string,
  imdbRating: string,
  publishedDate?: string,
  languages: string[],
  countries: string[],
  ageGroup: string,
  posterImageUrl: string,
  genres: string[],
  directors: IDirectors[],
  actors: IDirectors[],
  seasons: ISeasons[]
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
  deleteEpisod(seasons: string, episodId: string): void;
  deleteSeason(seasons: string): void;
  insertMovie(movie: ISeries): void;
  insertMovieSeasons(movie: ISeries, season: ISeasons): void;
  insertMovieEposid(movie: ISeries, season: ISeasons): void;
  setLoadingMsg(loading: string): void;
  clearStore(): void;
}

export type DataStoreType = DataStoreState & DataStoreReducers