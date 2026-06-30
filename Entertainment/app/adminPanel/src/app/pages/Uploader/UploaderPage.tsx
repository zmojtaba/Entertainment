import './i18n'
import classes from './Cameras/style.module.scss'
import { Navigate, Route, Routes } from 'react-router-dom'
import MovieList from './Cameras/MovieList'
import clsx from 'clsx'

const UserList = () => {
    return (
       <div className={clsx(classes.mainPage,'font-sans')}>
            <Routes>
                <Route path='/' element={<MovieList />} />
                <Route path={'*'} element={<Navigate to={'/uploader'} />} />
            </Routes>
        </div>
    )
}
export default UserList
