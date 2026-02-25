import './i18n'
import classes from './Cameras/style.module.scss'
import { Navigate, Route, Routes } from 'react-router-dom'
import CameraList from './Cameras/MovieList'
import MovieEditModal from './components/CameraEditModal'
import CreateNewGener from './components/NewGeger'
import AddSeasons from './components/AddSeasons/inedx'
import clsx from 'clsx'

const Series = () => {
    return (
        <div className={clsx( classes.mainPage,'font-sans')}>
            <Routes>
                <Route path='series/*' element={<CameraList />} >
                    <Route path={'new'} element={<MovieEditModal />} />
                    <Route path={'edit/:id'} element={<MovieEditModal />} />
                    <Route path={'new-gener'} element={<CreateNewGener />} />
                    <Route path={'seasons/:id'} element={<AddSeasons />} />
                </Route>
                <Route path={'*'} element={<Navigate to={'series'} />} />
            </Routes>
        </div>
    )
}
export default Series
