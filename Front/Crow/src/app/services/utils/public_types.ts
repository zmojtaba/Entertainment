import { IGenersItem } from "app/pages/Moves/store/type"
import React from "react"


export interface IFrameJSON {
  frame: string
  status: string
}

export interface IDirectors{
  name:string,
  imagePath?:string
}
export interface IMovie {
  id: string,
  title: string,
  description: string,
  imdbRating: string,
  language: string[],
  publishedDate?: string,
  countries: string[],
  ageGroup: string,
  genres: IGenersItem[],
  streamUrl:string,
  posterImageUrl:string,
  directors:IDirectors[],
  actors:IDirectors[],
}


export type setState<T> = React.Dispatch<React.SetStateAction<T>>

export type Modify<T, R> = Omit<T, keyof R> & R;

