import { MutableRefObject } from "react";

type CanvasInstance = HTMLCanvasElement | MutableRefObject<HTMLCanvasElement | null> | null

interface IOptions {
    downloadAfterStop?: boolean
}

export interface useRecorderFunc {
    (canvasInstance: CanvasInstance, options?: IOptions): {
        startRecording: () => Promise<MediaStream>;
        stopRecording: () => Promise<Blob>;
    }
}
