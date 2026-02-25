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
export interface IEpisodes {
    id: string,
    title: number,
    streamUrl: string
}
export interface IPodcast {
    id: string,
    title: string,
    description: string,
    languages: string[],
    ageGroup: string,
    posterImageUrl: string,
    genres: IGenersItem[],
    speakers: IDirectors[],
    episodes: IEpisodes[]
}