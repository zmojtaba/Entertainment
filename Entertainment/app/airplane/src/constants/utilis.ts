import { ItemSize, type CategoryMovie, type Categorys } from "../store/types";
import type { Tile } from "./types";
import montain from '@assets/images/iceland1.jpg'
import home from '@assets/images/home.png'

export const tilesSample: Tile[] = [
  { id: 1, title: 'Tile 1', size: 'large', color: '#2196f3' },
  { id: 2, title: 'Tile 2', size: 'small', color: '#f44336' },
  { id: 3, title: 'Tile 3', size: 'medium', color: '#4caf50' },
  { id: 4, title: 'Tile 4', size: 'small', color: '#ff9800' },
  { id: 5, title: 'Tile 5', size: 'large', color: '#9c27b0' },
  { id: 6, title: 'Tile 6', size: 'medium', color: '#009688' },
];
export const categoreys: Categorys[] = [
  {
    name: 'box1', image: 'iceland1',
    title: "Snow", subtitle: "Winter adventure testjjjsd", size: ItemSize.Small,
    type: 'Movies_&_series'
  },
  // {
  //   name: 'box2', image: 'iceland1',
  //   title: "Mountain", subtitle: "Adventure awaits dsfgsdgsdfgsdf", size: ItemSize.Small,
  //   type: 'Book'
  // },
  {
    name: 'box2', image: 'iceland1',
    title: "City", subtitle: "Urban vibes sdgsdfgsfd", size: ItemSize.Small,
    type: 'Magazine'
  },
  {
    name: 'box3', image: 'iceland1',
    title: "Forest", subtitle: "Reconnect with  sdgsdfg nature", size: ItemSize.Small,
    type: 'Audio_story'
  },
  {
    name: 'box4', image: 'iceland1',
    title: "Desert", subtitle: "Feel the dsgfsdgsdfg  sand", size: ItemSize.Small,
    type: 'Music'
  },
  // {
  //   name: 'box6', image: 'iceland1',
  //   title: "Snow", subtitle: "Winter  dfgsdg adventure", size: ItemSize.Large,
  //   type: 'Podcast'
  // },
  {
    name: 'box5', image: 'iceland1',
    title: "Snow", subtitle: "Winter adventure", size: ItemSize.Medium,
    type: 'Store'
  },
  {
    name: 'box6', image: 'iceland1',
    title: "Snow", subtitle: "Winter adventure", size: ItemSize.Small,
    type: "Map"
  },
  {
    name: 'box7', image: 'iceland1',
    title: "Snow", subtitle: "Winter adventure", size: ItemSize.Small,
    type: "Live_360"
  },
  {
    name: 'box8', image: '',
    title: "", subtitle: "", size: ItemSize.Small,
    type: "None"
  },
];
export const categoreyMovies: CategoryMovie[] = [
  {
    name: 'box1', image: montain,
    title: "Snow", subtitle: "Winter adventure testjjjsd", size: ItemSize.Small,
    type: 'Iranian_film'
  },
  {
    name: 'box2', image: home,
    title: "Mountain", subtitle: "Adventure awaits dsfgsdgsdfgsdf", size: ItemSize.Small,
    type: 'Iranian_series'
  },
  {
    name: 'box3', image: home,
    title: "City", subtitle: "Urban vibes sdgsdfgsfd", size: ItemSize.Small,
    type: 'International_film'
  },
  {
    name: 'box4', image: home,
    title: "Forest", subtitle: "Reconnect with  sdgsdfg nature", size: ItemSize.Small,
    type: 'International_series'
  },

];



export const createSchemaCategory = () => {
}
