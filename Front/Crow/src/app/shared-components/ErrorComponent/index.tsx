import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import classes from './index.module.scss'
import { CSSProperties } from 'react';

interface PropsType {
    onRetry?(): void;
    errorMessage?: string;
    error: boolean,
    style?:CSSProperties
}

export default function ErrorComponent(props: PropsType) {
    const { errorMessage, onRetry, error,style } = props;
    const { t } = useTranslation("layout")

    return (
        error ? <div style={style} className={classes.container} >
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '8em' }} color='error' className='animated bounce' />
            {errorMessage &&
                <p className={classes.message}>
                    {errorMessage}
                </p>}

            {onRetry &&
                <Button onClick={onRetry} variant='contained' size='small' color='info'>
                    {t('Retry')}
                </Button>}
        </div> : null
    )
}
