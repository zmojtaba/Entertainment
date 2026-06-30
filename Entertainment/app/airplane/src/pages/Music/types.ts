export const CategoryMusicItem = [
    "Iranian_Track",
    "International_Track",
    "Iranian_Album",
    "International_Album",
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
export interface Music {
    id: string,
    title: string,
    language: string[],
    streamUrl: string,
    posterImageUrl:string,
    genres: string[],
    singer: ISinger
}