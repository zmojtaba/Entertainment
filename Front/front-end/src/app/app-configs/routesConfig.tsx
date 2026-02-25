import { Navigate, RouteObject } from "react-router-dom"
import AppUtils from "@core/utils"
import AppLoading from "@core/components/AppLoading"
import Error404Page from "app/pages/404/Error404Page"
import LoginConfig from "app/pages/login/LoginConfig"
import MoviePageConfig from "app/pages/Moves/MoviePageConfig"
import MagazinPageConfig from "app/pages/Magazin/MagazinPageConfig"
import NewspaperPageConfig from "app/pages/Newspaper/NewspaperPageConfig"
import TrackPageConfig from "app/pages/Track/TrackPageConfig"
import AlbumPageConfig from "app/pages/Album/AlbumPageConfig"
import SeriesPageConfig from "app/pages/Series/SeriesPageConfig"
import BookPageConfig from "app/pages/Book/BookPageConfig"
import PodcastPageConfig from "app/pages/Podcast/PodcastPageConfig"
import StoryPageConfig from "app/pages/Story/StoryPageConfig"
import UserPageConfig from "app/pages/Users/UserPageConfig"


export type RouteItem = RouteObject & {
  setting?: any;
  auth?: string[];
  title?: string
}

const routeConfigs = [
  LoginConfig,
  MoviePageConfig,
  MagazinPageConfig,
  NewspaperPageConfig,
  TrackPageConfig,
  AlbumPageConfig,
  SeriesPageConfig,
  BookPageConfig,
  PodcastPageConfig,
  StoryPageConfig,
  UserPageConfig
]

const routes: RouteItem[] = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...AppUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  ...AppUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    path: "/",
    // element: <Navigate to={"/dashboard"} />
    element: <Navigate to={'movies'} />
  },
  {
    path: "loading",
    element: <AppLoading />
  },
  {
    path: "404",
    element: <Error404Page />
  },
  {
    path: "*",
    element: <Navigate to='404' />
  }

]

export default routes
