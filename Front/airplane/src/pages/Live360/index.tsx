import React, { useEffect, useRef } from 'react'
import classes from './style.module.scss'
import { IoReturnUpBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import logoImage from '@assets/images/download.png'
import ComingSoon from '@/shareComponents/ComingSoon';


function Live360Page() {
    const navigate = useNavigate()

    return (
        <div className={classes.container} >
            <div className={classes.header}>
                <div className={classes.backIcon} onClick={() => navigate('/')}>
                    <IoReturnUpBackOutline size={25} title='Back' />
                </div>
                <div className={classes.logo}>
                    <img src={logoImage} width={100} height={40} />
                </div>
            </div>

            <div className={classes.main}>
                <ComingSoon />
            </div>
        </div>
    )
}

export default Live360Page