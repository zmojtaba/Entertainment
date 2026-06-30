import { ComponentType, useState } from 'react'
import { IProps as CameraVideoPlayer } from '.'
import type { Modify } from 'app/services/utils/public_types'
import { toast } from 'react-toastify';
import ToastMsg from '../ToastMsg';
import { useCanvasRecorder } from '@core/hooks';

interface RecordProps {
    onRecordStart?(stream: MediaStream): void
    onRecordStop?(blob: Blob): void
}

export default function WithRecorder<T extends CameraVideoPlayer>(Component: ComponentType<T>) {

    return (props: Modify<T, RecordProps>) => {
        const [recording, setRecording] = useState(false);
        const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)
        const recorderApi = useCanvasRecorder(canvasElement, { downloadAfterStop: true, frameRate: 120 })
        const { onRecordStart, onRecordStop, ...JSMPEGRootProps } = props

        const handleStartRecord = () => {
            recorderApi.startRecording()
                .then(stream => {
                    setRecording(true);
                    props.onRecordStart?.(stream)
                }).catch(err => {
                    setRecording(false);
                    toast.error(<ToastMsg msg={err.message ?? 'Error'} />)
                });
            setRecording(true);
        }

        const handleStopRecord = () => {
            recorderApi.stopRecording()
                .then(blob => {
                    setRecording(false);
                    props.onRecordStop?.(blob)
                }).catch(err => {
                    toast.error(<ToastMsg msg={err.message ?? 'Error'} />)
                    setRecording(false);
                });
        }

        return (
            <Component
                {...JSMPEGRootProps as T}
                canvasRef={setCanvasElement}
                onRecordStart={handleStartRecord}
                onRecordStop={handleStopRecord}
                recording={recording}
            />
        )
    }
}
