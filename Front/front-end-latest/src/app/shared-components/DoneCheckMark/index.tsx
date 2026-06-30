import clsx from 'clsx'
import classes from './style.module.scss'

export default function index() {
    return (
        <svg version="1.1"  x="0px" y="0px" viewBox="0 0 37 37"  >
            <path className={clsx(classes.circ, "path")}
                style={{ strokeWidth: 3, strokeLinejoin: 'round', strokeMiterlimit: 10 }}
                d=" M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"
            />
            <polyline className={clsx(classes.tick, "path")}
                style={{ strokeWidth: 3, strokeLinejoin: 'round', strokeMiterlimit: 10 }}
                points="11.6,20 15.9,24.2 26.4,13.8"
            />
        </svg>
    )
}
