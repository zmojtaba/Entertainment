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


export interface IDirectors {
    name: string,
    imagePath?: string
}
export interface INewspaper {
    id: string,
    title: string,
    languages: string[],
    publishedDate: number,
    streamUrl: string,
    genres: string[],
    posterImageUrl: string,
    publisher: IDirectors
}