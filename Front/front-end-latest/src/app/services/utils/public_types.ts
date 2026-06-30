import React from "react"


export interface IFrameJSON {
  frame: string
  status: string
}

export interface IDirectors {
  name: string,
  imagePath?: string
}
export interface IMovie {
  id: string,
  title: string,
  description: string,
  subtitle: string,
  imdbRating: string,
  languages: string[],
  publishedDate?: string,
  countries: string[],
  ageGroup: string,
  genres: string[],
  streamUrl: string,
  posterImageUrl: string,
  directors: IDirectors[],
  actors: IDirectors[],
}


export type setState<T> = React.Dispatch<React.SetStateAction<T>>

export type Modify<T, R> = Omit<T, keyof R> & R;

