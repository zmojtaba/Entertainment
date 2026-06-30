import { CSSProperties } from 'react';
import './index.css'
import clsx from 'clsx'
import { Theme, useTheme } from '@mui/material';

type DOT_VARIANT =
    'elastic' |
    'pulse' |
    'flashing' |
    'collision' |
    'revolution' |
    'carousel' |
    'typing' |
    'windmill' |
    'bricks' |
    'floating' |
    'fire' |
    'spin' |
    'falling' |
    'stretching' |
    'gathering' |
    'overtaking' |
    'hourglass' |
    'shuttle';


const filterContrastList: DOT_VARIANT[] = [
    'gathering',
    'hourglass',
    'overtaking',
]

interface PropsType {
    variant: DOT_VARIANT;
    color?: CSSProperties['color'] | ((theme: Theme) => string);
    style?: CSSProperties
}

export default function index(props: PropsType) {
    const { color, variant, style } = props;
    const activeFC = filterContrastList.includes(variant);
    const theme = useTheme()
    const defaultColor = theme.palette.secondary[theme.palette.mode]
    const _color = typeof color === 'function' ? color(theme) : (color || defaultColor)

    return (
        <div
            className={clsx('stage', { 'filter-contrast': activeFC })}
            style={{
                '--color': _color,
                ...style
            } as CSSProperties}
        >
            <div className={`dot-${variant}`} />
        </div >
    )
}
