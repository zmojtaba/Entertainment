import { Backdrop } from '@mui/material';
import { PropsWithChildren } from 'react'
import { Suspense } from "react"
import ReactLoading from 'react-loading';

function LoadingFallback() {
    return (
        <Backdrop open sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column',
            zIndex: 8000
        }}>
            <ReactLoading
                type={'spinningBubbles'}
                width={90} height={90} />
            loading data...
        </Backdrop >

    );
};

export default function Index(props: PropsWithChildren) {
    return (
        <Suspense fallback={<LoadingFallback />}>
            {props.children}
        </Suspense>
    )
}
