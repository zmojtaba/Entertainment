
import classes from './style.module.scss'
import Slider from './components/Slider';

function MusicList() {
    return (
        <div className={classes.container}>
            <Slider />
        </div>
    )
}

export default MusicList