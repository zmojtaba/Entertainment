import { MutableRefObject, useRef } from 'react'

type CanvasInstance = HTMLCanvasElement | MutableRefObject<HTMLCanvasElement | null> | null
interface IOptions {
    downloadAfterStop: boolean,
    frameRate: number
}
interface useRecorderFunc {
    (canvasInstance: CanvasInstance, options?: Partial<IOptions>): {
        startRecording: () => Promise<MediaStream>;
        stopRecording: () => Promise<Blob>;
    }
}

const useCanvasRecorder: useRecorderFunc = (canvasInstance, options) => {
    const mediaRecorderRef = useRef<MediaRecorder>();
    const BlobsRef = useRef<Blob[]>([]);
    const canvasElement = (canvasInstance instanceof HTMLCanvasElement) ? canvasInstance : (canvasInstance?.current ?? null)


    function download() {
        const blob = new Blob(BlobsRef.current, {
            type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = "test.webm";
        a.click();
        window.URL.revokeObjectURL(url);
    }


    const startRecording = () => {
        return new Promise<MediaStream>((resolve, reject) => {
            if (!canvasElement) {
                reject(new Error('CANVAS_RECORDER: can not find canvas element'));
                return;
            }
            if (mediaRecorderRef?.current?.state === 'recording') {
                reject(new Error('CANVAS_RECORDER: already recording'))
                return;
            }
            try {
                // Optional frames per second argument.
                const stream = canvasElement.captureStream(options?.frameRate ?? 25);
                mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" });

                mediaRecorderRef.current.ondataavailable = (event) => {
                    BlobsRef.current.push(event.data);
                };
                resolve(stream)
                mediaRecorderRef.current.start();                                                                                                                                 
            } catch (e) {
                reject(e)
            }
        })
    }

    const stopRecording = () => {
        return new Promise<Blob>((resolve, reject) => {
            if (!mediaRecorderRef.current) {
                return reject('CANVAS_RECORDER: can not find recorder instance')
            }

            let mimeType = mediaRecorderRef?.current?.mimeType;
            //listen to the stop event in order to create & return a single Blob object
            mediaRecorderRef.current.addEventListener("stop", () => {
                //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
                let audioBlob = new Blob(BlobsRef.current, { type: mimeType });
                //resolve promise with the single audio blob representing the recorded audio
                resolve(audioBlob);
                options?.downloadAfterStop && download();
                mediaRecorderRef.current = undefined
            });
            //stop the recording feature
            mediaRecorderRef.current.stop();
        })
    }


    return {
        startRecording,
        stopRecording
    }
}

export default useCanvasRecorder
