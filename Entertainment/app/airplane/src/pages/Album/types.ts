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

interface ISinger {
    name: string,
    imagePath: string
}
export interface IEpisodes {
    id: string,
    episodeNumber: number,
    streamUrl: string
}
export interface IAlbum {
    id: string,
    title: string,
    languages: string[],
    posterImageUrl: string,
    genres: string[],
    singer: ISinger,
    episodes: IEpisodes[]
}