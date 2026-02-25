export const CategoryMusicItem = [
    "Music",
    "Album",
] as const;

export type CategoryMovieItemTypes = typeof CategoryMusicItem[number]
export interface CategoryMusic {
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
export interface IBook {
    id: string,
    title: string,
    description: string,
    rating: string,
    publishedDate: number,
    languages: string[],
    language?: string[],
    ageGroup: string,
    streamUrl: string,
    posterImageUrl: string,
    genres: IGenersItem[],
    writers: IDirectors[]
}