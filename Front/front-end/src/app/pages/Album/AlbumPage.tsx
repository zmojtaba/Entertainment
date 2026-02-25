import './i18n'
import classes from './Cameras/style.module.scss'
import { Navigate, Route, Routes } from 'react-router-dom'
import CameraList from './Cameras/MovieList'
import MovieEditModal from './components/CameraEditModal'
import CreateNewGener from './components/NewGeger'
import clsx from 'clsx'

const Albums = () => {
    return (
        <div className={clsx( classes.mainPage,'font-sans')}>
            <Routes>               
                <Route path='albums/*' element={<CameraList />} >
                    <Route path={'new'} element={<MovieEditModal />} />
                    <Route path={'new-gener'} element={<CreateNewGener />} />
                    <Route path={'edit/:id'} element={<MovieEditModal />} />
                </Route>           
                <Route path={'*'} element={<Navigate to={'albums'} />} />
            </Routes>
        </div>
    )
}
export default Albums
