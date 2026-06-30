import { useTranslation } from 'react-i18next';
import classes from '../Cameras/CameraItem/style.module.scss'

const headers = ['Type', 'Name', 'Percentage uploaded'];

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
