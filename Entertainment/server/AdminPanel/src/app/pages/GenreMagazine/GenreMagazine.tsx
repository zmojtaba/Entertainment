import './i18n'
import classes from './Cameras/style.module.scss'
import { Navigate, Route, Routes } from 'react-router-dom'
import CameraList from './Cameras/MovieList'
import CreateNewGener from './components/NewGeger'
import clsx from 'clsx'

const Magazine = () => {
    return (
        <div className={clsx( classes.mainPage,'font-sans')}>
            <Routes>
                <Route path='genres/*' element={<CameraList />} >
                    <Route path={'new-genre'} element={<CreateNewGener />} />
                </Route>
                <Route path={'*'} element={<Navigate to={'genres'} />} />
            </Routes>
        </div>
    )
}
export default Magazine
