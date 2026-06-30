import { useTranslation } from 'react-i18next';
import classes from '../Cameras/CameraItem/style.module.scss'

const headers = ['Title','Speakers',  'languages', 'Genres', 'Episodes', 'Edit', 'Delete'];

export default function TableHeader() {
    const { t } = useTranslation("SETTINGS");

    return (
        <div className={classes.tableHeader}>
            {
                headers.map((name, i) => (
                    <div className={classes.cell} key={i}>{name}</div>
                ))
            }
        </div>
    )
}
