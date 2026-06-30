import { Route, Routes } from 'react-router-dom'
import classes from './style.module.scss'
import Dashboard from './pages/Dashboard'
import CategoryMoviePage from './pages/CategoryMovie'
import MovieList from './pages/Movies'
import SeriesList from './pages/Series/index.js'
import MusicList from './pages/Music/index.js'
import CategoryMusicPage from './pages/Music/CategoryMusic/index.js'
import AlbumList from './pages/Album/index.js'
import MusicPlayer from './pages/Music/Player/index.js'
import CategoryMagzinPage from './pages/Magazin/CategoryMusic/index.js'
import MagazinList from './pages/Magazin/index.js'
import NewapaperList from './pages/Newspaper/index.js'
import ShowNewspaper from './pages/Newspaper/Player/index.js'
import CategoryAudioStoryPage from './pages/AudioStory/CategoryMusic/index.js'
import BookList from './pages/Book/index.js'
import ShowBook from './pages/Book/Player/index.js'
import PodcastList from './pages/Podcast/index.js'
import ShowPodcast from './pages/Podcast/Player/index.js'
import Audio_storyList from './pages/AudioStory/index.js'
import Audio_storyPlayer from './pages/AudioStory/Player/index.js'
import SwitchPlayer from './pages/Movies/pages/Film/SwitchPlayer.js'
import AlbumPlayer from './pages/Album/Player/index.js'
import ShowMagazin from './pages/Magazin/Player/index.js'
import MapPage from './pages/Map/index.js'
import StorePage from './pages/Store/index.js'
import Live360Page from './pages/Live360/index.js'


function App() {
  return (
    <div className={classes.mainPage}>
      <Routes >
        <Route path='/' element={<Dashboard />} />
        <Route path='Movies_&_series' element={<CategoryMoviePage />} />
        <Route path='Movies_&_series/Iranian_film' element={<MovieList />} />
        <Route path='Movies_&_series/International_film' element={<MovieList />} />
        <Route path='Movies_&_series/Iranian_series' element={<SeriesList />} />
        <Route path='Movies_&_series/International_series' element={<SeriesList />} />
        <Route path='Movies_&_series/:category/:id' element={<SwitchPlayer />} />
        {/* -----------------------------------Music--------------------------------------- */}
        <Route path='Music' element={<CategoryMusicPage />} />
        <Route path='Music/Music/:category' element={<MusicList />} />
        <Route path='Music/:category/:id' element={<MusicPlayer />} />

        {/* -----------------------------------Album--------------------------------------- */}
        <Route path='Music/Album/:category' element={<AlbumList />} />
        <Route path='Music/Album/:category/:id' element={<AlbumPlayer />} />
        
        {/* -----------------------------------Music--------------------------------------- */}

        {/* -----------------------------------Magazin--------------------------------------- */}
        <Route path='Magazine' element={<CategoryMagzinPage />} />
        <Route path='Magazine/:category' element={<MagazinList />} />
        <Route path='Magazine/:category/:id' element={<ShowMagazin />} />
        {/* -----------------------------------Newspaper--------------------------------------- */}
        <Route path='newspaper/:category' element={<NewapaperList />} />
        <Route path='newspaper/:category/:id' element={<ShowNewspaper />} />
        {/* -----------------------------------Newspaper--------------------------------------- */}
        {/* -----------------------------------Magazin--------------------------------------- */}

        {/* -----------------------------------AudioStory--------------------------------------- */}
        <Route path='Audio_story' element={<CategoryAudioStoryPage />} />
        <Route path='Book/:category' element={<BookList />} />
        <Route path='Book/:category/:id' element={<ShowBook />} />
        {/* -----------------------------------podcast--------------------------------------- */}
        <Route path='Podcast/:category' element={<PodcastList />} />
        <Route path='Podcast/:category/:id' element={<ShowPodcast />} />
        {/* -----------------------------------podcast--------------------------------------- */}
        {/* -----------------------------------podcast--------------------------------------- */}
        <Route path='Audio_story/:category' element={<Audio_storyList />} />
        <Route path='Audio_story/:category/:id' element={<Audio_storyPlayer />} />
        {/* -----------------------------------podcast--------------------------------------- */}
        {/* -----------------------------------AudioStory--------------------------------------- */}

        {/* -----------------------------------Map--------------------------------------- */}
        <Route path='Map' element={<MapPage />} />
        {/* <Route path='Map/:category' element={<MagazinList />} /> */}
        {/* <Route path='Map/:category/:id' element={<ShowMagazin />} /> */}
        {/* -----------------------------------Map--------------------------------------- */}
        {/* -----------------------------------Store--------------------------------------- */}
        <Route path='Store' element={<StorePage />} />
        {/* <Route path='Map/:category' element={<MagazinList />} /> */}
        {/* <Route path='Map/:category/:id' element={<ShowMagazin />} /> */}
        {/* -----------------------------------Store--------------------------------------- */}
        <Route path='Live_360' element={<Live360Page />} />
        {/* <Route path='Map/:category' element={<MagazinList />} /> */}
        {/* <Route path='Map/:category/:id' element={<ShowMagazin />} /> */}
        {/* -----------------------------------Store--------------------------------------- */}


        <Route path='*' element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
