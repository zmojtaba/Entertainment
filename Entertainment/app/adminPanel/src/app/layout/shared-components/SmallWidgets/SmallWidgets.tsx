import React, { ReactElement, useEffect, useState } from 'react'
import classes from './style.module.scss'
import { Box } from '@mui/material'
import axios from 'axios'
import { API_CONFIG } from 'app/app-configs/apiConfig'
import faceImage from 'assets/images/icon/boss.png'
import plate from 'assets/images/icon/car.png'

type widgetItemType = {
    id: number
    icon: ReactElement
    value: number
}

function SmallWidgets() {
    const [isPlateAnimation, setIsPlateAnimation] = useState(false)
    const [isFaceAnimation, setIsFaceAnimation] = useState(false)

    const [widgets, setWidgets] = useState<widgetItemType[]>([
        {
            id: 2,
            icon: <img src={plate} data-plate-opacity={isPlateAnimation} width={22} height={22} alt="plate" />,
            value: 0,
        },
        {
            id: 1,
            icon: <img src={faceImage} data-face-opacity={isFaceAnimation} width={22} height={22} alt="face" />,
            value: 0,
        },
    ])

    const fetchPlateCount = async () => {
        try {
            const response = await axios.get(`${API_CONFIG.plateDetection}/api/plate/number-of-detection`)
            const count = response.data || 0

            setIsPlateAnimation(count > 0)
            setWidgets((prevWidgets) =>
                prevWidgets.map((w) => (w.id === 2 ? { ...w, value: count } : w))
            )
        } catch (err) {
            setIsPlateAnimation(false)
            console.error('Plate fetch error:', err)
        }
    }

    const fetchFaceCount = async () => {
        try {
            const response = await axios.get(`${API_CONFIG.plateDetection}/api/face/number-of-detection`)
            const count = response.data || 0

            setIsFaceAnimation(count > 0)
            setWidgets((prevWidgets) =>
                prevWidgets.map((w) => (w.id === 1 ? { ...w, value: count } : w))
            )
        } catch (err) {
            setIsFaceAnimation(false)
            console.error('Face fetch error:', err)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            fetchPlateCount()
            // fetchFaceCount()
        }, 3000)

        fetchPlateCount()
        // fetchFaceCount()

        return () => clearInterval(interval)
    }, [])

    return (
        <Box sx={{ px: 1 }} className={classes.panel}>
            {widgets.map((widget) => (
                <div key={widget.id} className={classes.widget}>
                    {widget.id === 2 ? (
                        <img src={plate} data-plate-opacity={isPlateAnimation} width={22} height={22} alt="plate" />
                    ) : (
                        <img src={faceImage} data-face-opacity={isFaceAnimation} width={22} height={22} alt="face" />
                    )}
                    <div className={classes.widgetValue}>{widget.value}</div>
                </div>
            ))}
        </Box>
    )
}

export default SmallWidgets
