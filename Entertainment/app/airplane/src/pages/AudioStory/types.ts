export const CategoryMusicItem = [
    "Iranian_Book",
    "International_Book",

    "Iranian_Podcast",
    "International_Podcast",

    "Iranian_Audio_story",
    "International_Audio_story",
] as const;

export type CategoryMovieItemTypes = typeof CategoryMusicItem[number]
export interface CategoryStory {
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
export interface IEpisodes {
    id: string,
    title: number,
    streamUrl: string
}

export interface IDirectors {
    name: string,
    imagePath?: string
}
export type IAudioStory = {
    id: string,
    title: string,
    description: string,
    languages: string[],
    ageGroup: string,
    posterImageUrl: string,
    genres: string[],
    speakers: IDirectors[],
    episodes: IEpisodes[]
}