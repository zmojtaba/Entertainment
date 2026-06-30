
import classes from './style.module.scss'
import Slider from './components/Slider';

function MovieList() {

    return (
        <div className={classes.container}>
            <Slider />
        </div>
    )
}

export default MovieList