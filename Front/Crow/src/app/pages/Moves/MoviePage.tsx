import './i18n'
import classes from './Cameras/style.module.scss'
import { Navigate, Route, Routes } from 'react-router-dom'
import CameraList from './Cameras/MovieList'
import MovieEditModal from './components/CameraEditModal'
import clsx from 'clsx'

const Movies = () => {
    return (
        <div className={clsx( classes.mainPage,'font-sans')}>
            <Routes>
                <Route path='crews/*' element={<CameraList />} >
                    <Route path={'new'} element={<MovieEditModal />} />
                    <Route path={'edit/:id'} element={<MovieEditModal />} />
                </Route>
                <Route path={'*'} element={<Navigate to={'crews'} />} />
            </Routes>
        </div>
    )
}
export default Movies
