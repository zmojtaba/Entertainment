import { useRef, useState } from "react";
import Jmoment from 'jalali-moment'
import { Params, RECORDER_STATUS, RecorderApi } from "./types";

export const durationFormatter = (input: number) => {
    const convertToWithZero = (number = 0) => {
        return number < 10 ? '0' + number : number
    }
    const momentDuration = Jmoment.duration(Number(input), 'seconds'),
        seconds = convertToWithZero(momentDuration.seconds()),
        minutes = convertToWithZero(momentDuration.minutes()),
        hours = convertToWithZero(momentDuration.hours() + momentDuration.days() * 24);

    return hours + ":" + minutes + ":" + seconds;
}

const useRecorder = (params?: Params): RecorderApi => {
    const mediaRecorderRef = useRef<MediaRecorder>();
    const audioBlobsRef = useRef<Blob[]>();
    const [recordStatus, setRecordStatus] = useState(RECORDER_STATUS.INACTIVE);
    const [duration, setDuration] = useState(0);
    const durationInvRef = useRef<NodeJS.Timer>();
    const streamRef = useRef<MediaStream>();


    const startTimer = () => {
        let initTime = 0;
        durationInvRef.current = setInterval(() => {
            setDuration(++initTime)
        }, 1000)
    }

    const stopTimer = () => {
        clearInterval(durationInvRef.current);
    }


    const startRecording = () => {
        return new Promise<MediaStream>((resolve, reject) => {
            if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
                //Feature is not supported in browser
                //return a custom error
                reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'));
            } else {
                navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        ...params?.audioStreamConstraints
                    },
                })
                    .then((stream: MediaStream) /*of type MediaStream*/ => {
                        setRecordStatus(RECORDER_STATUS.RECORDING)
                        startTimer();
                        streamRef.current = stream;

                        // console.log('stream', stream)
                        //create a media recorder instance by passing that stream into the MediaRecorder constructor
                        mediaRecorderRef.current = new MediaRecorder(stream);
                        audioBlobsRef.current = [];

                        mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
                            // console.log('dataavailable', event)
                            audioBlobsRef.current?.push(event.data);
                        })

                        mediaRecorderRef.current.start();
                        resolve(stream)
                    }).catch(err => {
                        reject(err)
                        setRecordStatus(RECORDER_STATUS.INACTIVE);
                    });
            }
        })
    }

    const stopRecording = () => {
        return new Promise<Blob>((resolve, reject) => {
            if (recordStatus == RECORDER_STATUS.INACTIVE) {
                return
            }
            if (!mediaRecorderRef.current) {
                setRecordStatus(RECORDER_STATUS.INACTIVE)
                stopTimer()
                return reject('cant find audio recorder instance')
            }

            let mimeType = mediaRecorderRef?.current?.mimeType;
            //listen to the stop event in order to create & return a single Blob object
            mediaRecorderRef.current.addEventListener("stop", () => {
                //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
                let audioBlob = new Blob(audioBlobsRef.current, { type: mimeType });
                //resolve promise with the single audio blob representing the recorded audio
                resolve(audioBlob);
                stopTimer();
                streamRef.current?.getAudioTracks()[0].stop();
            });

            //stop the recording feature
            mediaRecorderRef.current.stop();
            setRecordStatus(RECORDER_STATUS.INACTIVE)
        })
    }

    //comming soon 
    const pauseRecording = () => {
        return new Promise((resolve, reject) => {
            setRecordStatus(RECORDER_STATUS.PAUSED)
            mediaRecorderRef.current?.pause();
        })
    }

    return {
        startRecording,
        stopRecording,
        //pauseRecording,
        recordStatus,
        duration
    }
}

export default useRecorder;
