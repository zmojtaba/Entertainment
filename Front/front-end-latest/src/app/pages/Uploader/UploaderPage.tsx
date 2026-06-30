import './i18n'
import classes from './Cameras/style.module.scss'
import { Navigate, Route, Routes } from 'react-router-dom'
import CameraEditModal from './components/CameraEditModal'
import MovieList from './Cameras/MovieList'
import clsx from 'clsx'

const UserList = () => {
    return (
       <div className={clsx(classes.mainPage,'font-sans')}>
            <Routes>
                <Route path='/' element={<MovieList />} />
                    {/* <Route path={'new'} element={<CameraEditModal />} /> */}
                    {/* <Route path={'edit/:id'} element={<CameraEditModal />} /> */}
                {/* </Route> */}
                <Route path={'*'} element={<Navigate to={'/uploader'} />} />
            </Routes>
        </div>
    )
}
export default UserList
