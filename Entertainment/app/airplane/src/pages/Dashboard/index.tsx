import React from 'react'
import classes from './style.module.scss'
import Home from '../Home'
import Category from '../Category'

function Dashboard() {
    return (
        <div className={classes.container}>
            <Home />                     
        </div>
    )
}

export default Dashboard