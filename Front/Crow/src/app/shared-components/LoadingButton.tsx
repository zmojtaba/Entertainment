import { Box, CircularProgress, IconButton, keyframes, Tooltip, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import UpdateIcon from '@mui/icons-material/Update';

interface PropsType {
    onClick(): void;
    timer: number;
    loading: boolean; //if loading ture counter will be disabled
}

const roateAnimation = keyframes`
from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
`

export default function LoadingButton(props: PropsType) {
    const { loading, timer } = props
    const counterIntervalID = useRef<NodeJS.Timer>()
    const [counter, setCounter] = useState(0)

    const startCounting = () => {
        let x = 0
        counterIntervalID.current = setInterval(() => {
            setCounter(++x)
            if (x === timer)
                handleClickButton()
        }, 10000)
    }

    useEffect(() => {
        return () => clearInterval(counterIntervalID.current)
    }, [])

    useEffect(() => {
        if (timer) {
            setCounter(0)
            clearInterval(counterIntervalID.current)
            startCounting()
        }
    }, [loading])

    const handleClickButton = () => {
        if (!loading) {
            setCounter(0)
            props.onClick()
        }
    }

    return (
        <Tooltip title={'بروزرسانی'}>
            <IconButton  onClick={handleClickButton} sx={{ position: 'relative', display: 'inline-flex' }} disabled={loading}>
                {!loading ?
                    <>
                        {timer && <CircularProgress variant="determinate" value={100 - ((counter / timer) * 100)} size={32} />}
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }} >
                            <Typography
                                component="div"
                                color="text.secondary"
                                fontWeight={'bold'}
                            >   {timer - counter}</Typography>
                        </Box>
                    </>
                    :
                    <UpdateIcon sx={{ animation: `${roateAnimation} 2s linear infinite` }} color='info' fontSize='large' />}
            </IconButton>
        </Tooltip>
    )
}
