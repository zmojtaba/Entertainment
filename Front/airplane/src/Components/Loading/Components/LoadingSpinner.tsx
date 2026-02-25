import classes from './style.module.scss'
import animationData from '@assets/lottieFiles/loading.json'
import Lottie from 'lottie-react'

type propsType = {
    loading: boolean,
    message?: string
}

function LoadingSpinner(props: propsType) {
    const { loading, message = 'Please wait ...' } = props;

    return (
        <>
            {
                loading ?
                    <div className={classes.container} >
                        <div className={classes.panel} >                          
                            <div className={classes.logo} >
                                <Lottie
                                    size={100}
                                    animationData={animationData}
                                    loop
                                    autoPlay />
                                <span>{message}</span>
                            </div >
                        </div >
                    </div >

                    :
                    null
            }
        </>
    )
}

export default LoadingSpinner