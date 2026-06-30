// import { IDirectors, IMovie } from "app/services/utils/public_types";
export interface IUploaderItem {
  id: string;
  title: string;
  downloadStatus: number;
  downloadErrorMessage: string;
  currentlyDownload: boolean;
  downloadRetryCount: number;
}
interface IEpisodes {
  id: string;
  episodeNumber: number;
  currentlyDownload: boolean;
  downloadStatus: number;
  downloadErrorMessage: string;
  downloadRetryCount: number;
}
// ------------------------------------------seryal------------------------
interface ISeasons extends IUploaderItem  {
  seasonNumber: number;
  seriesId: string;
  episodes: IEpisodes[];
}
export interface ISeriesItem extends IUploaderItem {
  seasons: ISeasons[];
}
// ------------------------------------------seryal------------------------
export interface IAllItemType extends IAlbume,ISeriesItem{

}


// ------------------------------------------Albom------------------------

export interface IAlbume extends IUploaderItem {
  episodes: IUploaderItem[];
}
// ------------------------------------------seryal------------------------
export type UploadData = {
  movies: IUploaderItem[];
  series: ISeriesItem[];
  corus: IUploaderItem[];
  tracks: IUploaderItem[];
  albums: IAlbume[];
  magazines: IUploaderItem[];
  newsPapers: IUploaderItem[];
  books: IUploaderItem[];
  audioStories: IAlbume[];
  podCasts: IAlbume[];
};

export interface IGenersItem {
  title: string;
}

export interface IDirectors {
  name: string;
  imagePath?: string;
}
export interface IMagazin {
  id: string;
  username: string;
  role: string;
  refreshToken: string;
  password?: string;
  confirmPassword?: string;
}

export type DataRefrence = {
  genres: IGenersItem[];
  actors: IDirectors[];
  directores: IDirectors[];
  languages: string[];
  countries: string[];
};

export type DataStoreState = {
  movieList: UploadData;
  loadingMsg: string;
  errorLoadingMovies: boolean;
  loadingMovieList: boolean;
};
export type Progress = {
  percent: string;
  formatted: string;
  loaded: string;
  total: string;
  completed: boolean;
};

export type DataStoreReducers = {
  loadMovieList(): void;
  setLoadingMsg(loading: string): void;
  clearStore(): void;
};

export type DataStoreType = DataStoreState & DataStoreReducers;
