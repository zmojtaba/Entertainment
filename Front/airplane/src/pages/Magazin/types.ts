export const CategoryMusicItem = [
    "Iranian_Magazine",
    "International_Magazine",
    "Iranian_Newspaper",
    "International_Newspaper",
] as const;

export type CategoryMovieItemTypes = typeof CategoryMusicItem[number]
export interface CategoryMagazin {
    name: string,
    title: string,
    subtitle: string,
    image: string,
    type: CategoryMovieItemTypes
}
interface ISinger {
    name: string,
    imagePath: string
}
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
    languages: string[],
    publishedDate: number,
    streamUrl: string,
    genres: IGenersItem[],
    posterImageUrl: string,
    publisher: IDirectors
}

export type DataRefrence = {
    genres: IGenersItem[],
    actors: IDirectors[],
    directores: IDirectors[],
    languages: string[],
    countries: string[]
}