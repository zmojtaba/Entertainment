import './i18n'
import classes from './Cameras/style.module.scss'
import { Navigate, Route, Routes } from 'react-router-dom'
import CameraList from './Cameras/MovieList'
import MovieEditModal from './components/CameraEditModal'
import CreateNewGener from './components/NewGeger'
import clsx from 'clsx'

const PodcastsList = () => {
    return (
        <div className={clsx( classes.mainPage,'font-sans')}>
            <Routes>
                <Route path='podcasts/*' element={<CameraList />} >
                    <Route path={'new'} element={<MovieEditModal />} />
                    <Route path={'edit/:id'} element={<MovieEditModal />} />
                    <Route path={'new-gener'} element={<CreateNewGener />} />
                </Route>
           
                <Route path={'*'} element={<Navigate to={'podcasts'} />} />
            </Routes>
        </div>
    )
}
export default PodcastsList
