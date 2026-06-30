import { styled, useTheme } from '@mui/material';

const Rect = styled('rect')(({ theme }) => {
    return {
        fill: theme.palette.primary.light,
    }
})

export const EmptyCameraListIcon = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode == 'dark'

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="111.997" viewBox="0 0 300 111.997">
            <defs>
                <linearGradient id="linear-gradient" x1="-0.429" y1="-0.276" x2="1.16" y2="1.361" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor={theme.palette.secondary[theme.palette.mode]} />
                    <stop offset="1" stopColor={theme.palette.primary[theme.palette.mode]} />
                </linearGradient>
            </defs>
            <g id="no_data" data-name="no data" transform="translate(-239.247 -81.333)">
                <g id="No_data-2" data-name="No data" transform="translate(239.247 81.333)" opacity="0.2">
                    <Rect id="Rectangle_544" data-name="Rectangle 544" width="118.374" height="20.293" rx="10.146" transform="translate(91.151)" />
                    <Rect id="Rectangle_543" data-name="Rectangle 543" width="108.227" height="20.969" rx="10.485" transform="translate(0 45.176)" />
                    <Rect id="Rectangle_548" data-name="Rectangle 548" width="54.79" height="20.293" rx="10.146" transform="translate(53.365 91.028)" />
                    <Rect id="Rectangle_658" data-name="Rectangle 658" width="54.79" height="20.293" rx="10.146" transform="translate(245.21 91.028)" />
                    <Rect id="Rectangle_550" data-name="Rectangle 550" width="47.349" height="20.293" rx="10.146" transform="translate(0 91.028)" />
                    <Rect id="Rectangle_549" data-name="Rectangle 549" width="84.553" height="20.293" rx="10.146" transform="translate(153.987 91.028)" />
                    <Rect id="Rectangle_546" data-name="Rectangle 546" width="90.64" height="20.969" rx="10.485" transform="translate(164.716 45.176)" />
                    <Rect id="Rectangle_541" data-name="Rectangle 541" width="85.905" height="20.293" rx="10.146" />
                    <Rect id="Rectangle_545" data-name="Rectangle 545" width="84.553" height="20.293" rx="10.146" transform="translate(215.447)" />
                    <Rect id="Rectangle_547" data-name="Rectangle 547" width="34.497" height="20.969" rx="10.485" transform="translate(265.503 45.176)" />
                    <Rect id="Rectangle_657" data-name="Rectangle 657" width="34.497" height="20.969" rx="10.485" transform="translate(115.862 45.176)" />
                    <Rect id="Rectangle_659" data-name="Rectangle 659" width="34.497" height="20.969" rx="10.485" transform="translate(113.497 91.028)" />
                </g>
                <path id="videocam_FILL1_wght400_GRAD0_opsz48" d="M6.988,74.541a6.7,6.7,0,0,1-4.892-2.1A6.7,6.7,0,0,1,0,67.553V6.988A6.7,6.7,0,0,1,2.1,2.1,6.7,6.7,0,0,1,6.988,0H67.553a6.7,6.7,0,0,1,4.892,2.1,6.7,6.7,0,0,1,2.1,4.892V32.029L93.176,13.394V61.147L74.541,42.512V67.553a7.165,7.165,0,0,1-6.988,6.988Z" transform="translate(335.027 112.439) rotate(-14)" fill="url(#linear-gradient)" />
                <path id="help_FILL0_wght400_GRAD0_opsz48"
                    d="M16.116,25.251a1.5,1.5,0,1,0-1.077-.439A1.464,1.464,0,0,0,16.116,25.251Zm-1.4-5.824h2.354a6.529,6.529,0,0,1,.259-1.895,4.7,4.7,0,0,1,1.616-1.975A6.98,6.98,0,0,0,20.7,13.523a4.683,4.683,0,0,0,.519-2.194,4.4,4.4,0,0,0-1.376-3.391A5.154,5.154,0,0,0,16.2,6.662a6.166,6.166,0,0,0-3.451.977,5.582,5.582,0,0,0-2.174,2.693l2.114.8A3.722,3.722,0,0,1,14,9.394a3.509,3.509,0,0,1,2.074-.618,3.2,3.2,0,0,1,2.194.738,2.411,2.411,0,0,1,.838,1.895,2.933,2.933,0,0,1-.519,1.656,7.947,7.947,0,0,1-1.516,1.616A8.114,8.114,0,0,0,15.3,16.735a5.43,5.43,0,0,0-.578,2.693Zm1.237,12.486a15.44,15.44,0,0,1-6.183-1.257A16.077,16.077,0,0,1,1.257,22.14,15.44,15.44,0,0,1,0,15.957,15.538,15.538,0,0,1,1.257,9.734,15.947,15.947,0,0,1,4.687,4.667,16.357,16.357,0,0,1,9.773,1.257,15.44,15.44,0,0,1,15.957,0,15.538,15.538,0,0,1,22.18,1.257a15.932,15.932,0,0,1,8.477,8.477,15.538,15.538,0,0,1,1.257,6.223,15.44,15.44,0,0,1-1.257,6.183,16.357,16.357,0,0,1-3.411,5.086,15.947,15.947,0,0,1-5.066,3.431A15.538,15.538,0,0,1,15.957,31.913Zm0-2.394a13.051,13.051,0,0,0,9.614-3.969,13.1,13.1,0,0,0,3.949-9.594,13.085,13.085,0,0,0-3.949-9.614,13.085,13.085,0,0,0-9.614-3.949A13.1,13.1,0,0,0,6.363,6.343a13.051,13.051,0,0,0-3.969,9.614,13.071,13.071,0,0,0,3.969,9.594A13.071,13.071,0,0,0,15.957,29.52ZM15.957,15.957Z" transform="matrix(0.966, -0.259, 0.259, 0.966, 362.969, 126.048)"
                    fill={theme.palette.common.white} />
            </g>
        </svg>
    )
}




