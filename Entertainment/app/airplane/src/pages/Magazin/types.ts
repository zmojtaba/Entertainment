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
    genres: string[],
    posterImageUrl: string,
    publisher: IDirectors
}

export type DataRefrence = {
    genres: string[],
    actors: IDirectors[],
    directores: IDirectors[],
    languages: string[],
    countries: string[]
}