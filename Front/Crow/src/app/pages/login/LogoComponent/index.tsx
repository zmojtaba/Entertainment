import clsx from 'clsx'
import classes from './style.module.scss'
import AILogoImage from 'assets/images/logos/7893979.png'
import { useAppSelector } from 'app/store/hooks'

interface PropsType {
    color?: string
}

export default function Index(props: PropsType) {
    // console.log("index", 'سکوی_ هوشمند_ و_ یکپارچه'.split('_'))
    const navbar = useAppSelector(({ fuse }) => fuse.navbar)

    return (
        <div className={classes.container}
            style={{
                color: props.color ?? 'inherit',
            }}>
            <img
                className={classes.logoIcon}
                src={AILogoImage}
                alt="logo-icon"
            />
            {/* <div className={classes.mainLabel}>
                {''.split('').map((c, index) => (
                    <span key={index}

                        className={classes.charItem}
                        style={{
                            animationDelay: index * 300 + 'ms',
                            fontSize: navbar.open ? '18px' : '13px'
                        }}
                    >
                        {c}
                    </span>
                ))}
            </div>
            {navbar.open &&
                <div className={classes.subLabel}>
                    {'سکوی_ هوشمند_ و_ یکپارچه'.split('_').map((c, index) => (
                        // <span key={index} className={"animated  zoomInRight "}
                        <span key={index} className={clsx(classes.charItem, "animated  zoomInRight")}
                            style={{
                                animationDelay: index * 500 + 'ms'
                            }}
                        >
                            {c}
                        </span>
                    ))}
                </div>
            } */}
        </div>
    )
}
