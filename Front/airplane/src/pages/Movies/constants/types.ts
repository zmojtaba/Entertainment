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
    genres: { title: string }[]
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
export interface IGenersItem {
    title: string
}

export interface IDirectors {
    name: string,
    imagePath?: string
}
export type Movie = {
    id: string,
    title: string,
    description: string,
    imdbRating: string,
    language: string[],
    publishedDate?: string,
    countries: string[],
    ageGroup: string,
    genres: string[],
    streamUrl: string,
    posterImageUrl: string,
    directors: IDirectors[],
    actors: IDirectors[],
}