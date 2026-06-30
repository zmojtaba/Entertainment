export enum RECORDER_STATUS {
    INACTIVE = 'inactive',
    RECORDING = 'recording',
    PAUSED = 'paused'
}

export interface RecorderApi {
    startRecording(): Promise<MediaStream>
    stopRecording(): Promise<Blob>
    //  pauseRecording(): Promise<any>
    recordStatus: RECORDER_STATUS,
    duration: number
}

export interface Params {
    audioStreamConstraints?: MediaTrackConstraints
}