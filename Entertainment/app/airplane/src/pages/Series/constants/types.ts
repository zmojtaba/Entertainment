export const ItemSize = {
    Small: "small",
    Medium: "medium",
    Large: "large",
} as const;

export type ItemSize = typeof ItemSize[keyof typeof ItemSize];

export const CategoryList = [
    "Movies_&_series",
    "Map",
    "Audio_story",
    "Book",
    "Music",
    "Podcast",
    "Store",
    "Magazine",
    "Live_360",
    "None"
] as const;
// console.log(CategoryList);

export type CategoryTypes = typeof CategoryList[number]
export interface Categorys {
    name: string,
    title: string,
    subtitle: string,
    image: string,
    size: ItemSize,
    type: CategoryTypes
}

export const CategoryMovieItem = [
    "Iranian_series",
    "International_series",
    "Iranian_film",
    "International_film",
] as const;

export type CategoryMovieItemTypes = typeof CategoryMovieItem[number]
export interface CategoryMovie {
    name: string,
    title: string,
    subtitle: string,
    image: string,
    size: ItemSize,
    type: CategoryMovieItemTypes
}

export type Genre = {
    genres: string[]
}

export interface MousePos {
    x: number;
    y: number;
    target: string | null;
}
interface director {
    name: string,
    imagePath: string
}

export interface IDirectors {
    name: string,
    imagePath?: string
}
export interface ISeasons {
    id: string,
    seasonNumber: number,
    episodes: IEpisodes[]
}
export interface IEpisodes {
    id: string,
    episodeNumber: number,
    streamUrl: string,
    subtitleUrl?: string
}
export type Series = {
    id: string,
    title: string,
    description: string,
    imdbRating: string,
    publishedDate?: string,
    language: string[],
    countries: string[],
    ageGroup: string,
    posterImageUrl: string,
    genres: string[],
    directors: IDirectors[],
    actors: IDirectors[],
    seasons: ISeasons[]
}