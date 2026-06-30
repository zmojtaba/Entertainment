
import classes from './style.module.scss'
import Slider from './components/Slider';

function AlbumList() {
    return (
        <div className={classes.container}>
            <Slider />
        </div>
    )
}

export default AlbumList