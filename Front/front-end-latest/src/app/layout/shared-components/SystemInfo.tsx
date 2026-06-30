import { alpha, darken, Divider, lighten, Stack, useTheme } from '@mui/material'
import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { API_CONFIG } from "app/app-configs/apiConfig"
import axios from 'axios'

type InfoHardWaresUsage = {
    cpu: number,
    ram: { total: string, used: string, free: string, usagePercent: number }
}
const initInfo: InfoHardWaresUsage = {
    cpu: 0,
    ram: { total: "16", used: "9.20", free: "2.32", usagePercent: 0 }
}


function SystemInfo() {
    const theme = useTheme()
    const fetchSystemInfoData = async () => {
        try {
            const response = await axios.get(`${API_CONFIG.plateDetection}/api/camera/system-usage`);
            // console.log("systemInfo", response.data)
            // setInfo({ ...info, cpu: Math.floor(Math.random() * 101) })
            setInfo(response.data)

        } catch (err) {
            // setError('خطا در دریافت داده: ' + err.message);
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            fetchSystemInfoData()
        }, 50000);
        fetchSystemInfoData()
        return () => clearInterval(interval)
    }, [])

    const getBarColor = (percent: number) => {
        if (percent < 60) return darken(theme.palette.success.light, 0.1);
        if (percent >= 60 && percent < 80) return lighten(theme.palette.warning.main, 0.2);
        return theme.palette.error.dark;
    };

    const [info, setInfo] = useState<InfoHardWaresUsage>(initInfo)
    return (
        <Stack direction='column' spacing={0.5}
            className='flex flex-1 text-[15px] font-400  h-full 
          items-center justify-start textSecondary  '>

            <Stack direction={'row-reverse'}
                spacing={0.8}
                className='flex items-center justify-center'
            >
                <Typography color='textPrimary' >CPU</Typography>
                <div className='flex items-center justify-center flex-row-reverse gap-[5px]'>
                    <Box
                        sx={{
                            // borderColor: getBarColor(+info.cpu),
                            backgroundColor: darken(theme.palette.text.secondary, 0.1),

                        }}
                        className={`flex-1  min-h-[18px] min-w-[130px] flex rounded-[10px]  relative overflow-hidden`}>

                        <Box sx={{
                            // bgcolor: getBarColor(+info.cpu),
                            // borderColor: getBarColor(+info.cpu),
                            backgroundColor: getBarColor(+info.cpu),// 'primary.light',
                            color: 'white',
                            zIndex: 19
                        }}
                            className={`absolute left-0 top-0   h-full                      
                         rounded-[7px] text`}
                            style={{ width: `${info.cpu}%` }}>
                        </Box>
                        <Typography sx={{ direction: 'rtl' }} color='white'
                            className={` min-w-5 
                                dir
                           flex   flex-1 justify-center items-center
                          text-[12px] z-20`}>{`${info?.cpu}%`}</Typography>
                    </Box>
                </div>
            </Stack>

            <Stack direction={'row-reverse'}
                className='flex items-center justify-center'
                spacing={0.8}>
                <Typography color='textSecondary' >RAM</Typography>
                <div className='flex items-center justify-center flex-row-reverse gap-[5px]'>
                    <Box
                        sx={{
                            backgroundColor: darken(theme.palette.text.secondary, 0.1),
                            // borderColor: getBarColor(info.ram.usagePercent),
                        }}
                        className={`flex-1  min-h-[18px] min-w-[130px] flex overflow-hidden     
                         rounded-[11px]  relative  `}>
                        <Box sx={{
                            // bgcolor: getBarColor(+info.ram.usagePercent),
                            // borderColor: getBarColor(+info.ram.usagePercent)
                            backgroundColor: getBarColor(+info.ram.usagePercent),// theme.palette.primary.light,
                            color: 'white'

                        }} className={`absolute left-0 top-0   h-full                  
                         rounded-[7px] text`}
                            style={{ width: `${info.ram.usagePercent}%` }}>

                        </Box>
                        <Typography color='white'
                            sx={{ dir: 'ltr' }}
                            className={` min-w-5 top-1
                           flex  flex-1 justify-center items-center
                          text-[12px] z-20`}>{info?.ram.usagePercent}%</Typography>
                    </Box>
                </div>
            </Stack>

        </Stack >
    )
}

export default SystemInfo