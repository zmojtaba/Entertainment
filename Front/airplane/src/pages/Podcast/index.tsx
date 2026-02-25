
import classes from './style.module.scss'
import Slider from './components/Slider';

function PodcastList() {
    return (
        <div className={classes.container}>
            <Slider />
        </div>
    )
}

export default PodcastList