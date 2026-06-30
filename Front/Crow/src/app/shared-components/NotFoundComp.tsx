import { Typography, darken, styled } from '@mui/material'
import { motion } from 'framer-motion'
import blueGrey from '@mui/material/colors/blueGrey';
import { grey } from '@mui/material/colors';

const G1 = styled('g')(({ theme }) => {
    return {
        stroke: theme.palette.mode === 'light' ? blueGrey[100] : blueGrey[500],
    }
});


const G2 = styled('g')(({ theme }) => {
    return {
        stroke: theme.palette.mode === 'light' ? blueGrey[100] : blueGrey[500],
    }
})

const Path = styled('path')(({ theme }) => {
    return {
        fill: theme.palette.mode === 'light' ? blueGrey[100] : blueGrey[500],
    }
})
const Circle = styled('circle')(({ theme }) => {
    return {
        stroke: theme.palette.mode === 'light' ? blueGrey[100] : blueGrey[500],
        strokeWidth: 6
    }
})

const Rect1 = styled('rect')(({ theme }) => {
    return {
        fill: theme.palette.mode === 'light' ? grey[50] : darken(theme.palette.divider, .3),
    }
})
const Rect2 = styled('rect')(({ theme }) => {
    return {
        fill: theme.palette.mode === 'light' ? blueGrey[50] : darken(theme.palette.divider, .3),
    }
})
const Rect3 = styled('rect')(({ theme }) => {
    return {
        stroke: theme.palette.mode === 'light' ? blueGrey[50] : darken(theme.palette.divider, .3),
    }
})


const NotFoundSvg = () => (
    <svg
        style={{
            minWidth: 200,
            minHeight: 200,
            width: '50%',
            height: '50%',
            maxHeight: 400,
            maxWidth: 500
        }}
        viewBox="0 0 258 309" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Rect1 x="69" y="37.6074" width="132" height="175" rx="6" ></Rect1>
        <Rect2 x="37" y="57.6074" width="139" height="175" rx="6" ></Rect2>
        <Rect3 x="20" y="75.6074" width="130" height="173" rx="5" strokeWidth="2" strokeDasharray="6 6"></Rect3>

        <G2>
            <g opacity="0.9">
                <line x1="65.0336" y1="73.5302" x2="52.6785" y2="85.375" strokeWidth="5"></line>
                <line x1="65.2769" y1="85.6412" x2="53.4321" y2="73.2861" strokeWidth="5"></line>
            </g>
            <g opacity="0.9">
                <path d="M93.5 138.607C93.5 138.607 94 125.107 106.5 125.107C119 125.107 119.5 138.607 119.5 138.607"
                    strokeWidth="2.5"></path>
                <circle cx="131.5" cy="117.107" r="4.5" ></circle>
                <circle cx="82.5" cy="117.107" r="4.5" ></circle>
            </g>
        </G2>
        <G1>
            <line x1="56.5" y1="159.107" x2="156.5" y2="159.107" strokeWidth="5" strokeLinecap="round"></line>
            <line x1="56.5" y1="173.107" x2="156.5" y2="173.107" strokeWidth="5" strokeLinecap="round"></line>
            <line x1="56.5" y1="201.107" x2="156.5" y2="201.107" strokeWidth="5" strokeLinecap="round"></line>
            <line x1="56.5" y1="187.107" x2="156.5" y2="187.107" strokeWidth="5" strokeLinecap="round"></line>
            <line x1="56.5" y1="215.107" x2="156.5" y2="215.107" strokeWidth="5" strokeLinecap="round"></line>
        </G1>
        <g>
            <circle opacity="0.05" cx="187" cy="226" r="36"
                fill="#050505"></circle>
            <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M212.86 215.527L172.814 251.43C171.787 250.57 170.825 249.631 169.936 248.618L210.254 212.471C211.196 213.416 212.068 214.436 212.86 215.527Z"
                fill="white"></path>
            <path opacity="0.5" fillRule="evenodd" clipRule="evenodd" d="M216.722 226.114C216.563 225.407 216.373 224.702 216.151 223.998C215.613 222.287 214.916 220.669 214.08 219.157L176.461 253.566C178.524 254.96 180.778 256.057 183.151 256.82L216.722 226.114Z"
                fill="white"></path>

            <Path d="M208.879 265.049L220.193 255.201L253.119 293.03C255.775 296.081 255.733 300.466 253.025 302.823L251.517 304.136C248.809 306.492 244.46 305.929 241.804 302.877L208.879 265.049Z"
            ></Path>
            <Path d="M202.263 252.878L209.052 246.969L220.89 260.571L214.101 266.479L202.263 252.878Z"
            ></Path>

            <Circle cx="187" cy="226" r="33"
            ></Circle>

        </g>

        <g opacity="0.9">
            <Path d="M31.3174 39.8878C32.0755 41.7677 31.1664 43.9057 29.2865 44.6638C27.4075 45.4216 25.2686 44.5128 24.5105 42.6329C23.7527 40.754 24.6624 38.6147 26.5414 37.8569C28.4213 37.0988 30.5596 38.0088 31.3174 39.8878Z"
            >
            </Path>
            <Path d="M13.3067 5.04939C6.39788 7.83562 3.04842 15.6866 5.84001 22.6087L5.8418 22.6132C6.59957 24.4922 8.73723 25.4004 10.6171 24.6423C12.497 23.8842 13.4051 21.7435 12.6469 19.8636C11.378 16.7172 12.8904 13.1313 16.0563 11.8545C19.2045 10.5849 22.7989 12.1134 24.0689 15.2624C25.3385 18.4106 23.8101 22.0051 20.6619 23.2747C18.782 24.0328 17.8732 26.1717 18.631 28.0507L20.1011 31.6962C20.8592 33.576 22.9973 34.4852 24.8771 33.7271C26.7561 32.9693 27.6662 30.8309 26.908 28.951L26.621 28.2393C31.2748 24.6344 33.1834 18.2394 30.8758 12.5173C28.0921 5.61468 20.2129 2.26423 13.3067 5.04939Z"
            >
            </Path>
        </g>
    </svg>
)


export default function NotFoundComp({ message }: { message?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -60, }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0 } }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <NotFoundSvg />
            <Typography variant='subtitle1' sx={{ color: 'text.primary' }}>
                {message}
            </Typography>
        </motion.div>
    )
}
