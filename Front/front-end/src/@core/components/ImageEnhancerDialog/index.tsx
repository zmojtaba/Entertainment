import { Dialog, DialogContent } from '@mui/material'
import { useAppSelector } from 'app/store/hooks'
// import ImageEnhancer from 'app/pages/FaceDetection/ImageEnhancer'


export default function ImageEnhancerDialog() {
    const imageUrl = useAppSelector((state) => state.imageEnhancer.imageUrl)

    return (
        <Dialog
            open={Boolean(imageUrl)}
            fullWidth
            maxWidth='xl'

        >
            <DialogContent sx={{ p: 1, height: 'calc(100vh - 40px)' }} >
                {/* <ImageEnhancer imageUrl={imageUrl} /> */}
            </DialogContent>
        </Dialog >
    )
}
