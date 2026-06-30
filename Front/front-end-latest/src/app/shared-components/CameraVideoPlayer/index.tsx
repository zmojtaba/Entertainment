import classes from './index.module.scss'
import React, { Component, ComponentType } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';
// import { _CameraRules } from 'app/pages/FaceDetection/constants';
import { TFunction, withTranslation } from 'react-i18next';
import validator from 'validator';
import { IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { API_CONFIG } from 'app/app-configs/apiConfig'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import WithRecorder from './WithRecorder';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Client } from '@stomp/stompjs';

export const IPV4_REGEX = () => {
    const IPv4SegmentFormat = '(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])';
    const IPv4AddressFormat = `(${IPv4SegmentFormat}[.]){3}${IPv4SegmentFormat}$`;
    return new RegExp(IPv4AddressFormat);
}

const isWSLink = (link: string) => {
    return validator.isURL(link, {
        protocols: ['ws'],
        require_port: true,
        host_whitelist: ['localhost', IPV4_REGEX()]
    })
}

interface IState {
    error: string,
    // playing: boolean,
    // fullScreen: boolean
}
export interface IProps {
    hostIP?: string;
    socketPort?: number;
    options?: any;
    overlayOptions?: any;
    t?: TFunction;
    onRecordStart?(): void;
    onRecordStop?(): void;
    canvasRef?: (canvas: HTMLCanvasElement) => void;
    recording?: boolean;
    videoPath?: string;
    rtsp?: string;
    picMode?: boolean
}

class CameraVideoPlayer extends Component<IProps, IState> {
    videoInstanceRef: JSMpeg;
    videoElement: React.RefObject<HTMLCanvasElement>;
    videoWrapperElement: React.RefObject<HTMLDivElement>;
    _videoUrl = `ws://${this.props.hostIP}:${this.props.socketPort}/`;
    rtsp = this.props.rtsp;
    private ws: WebSocket | undefined;

    constructor(props) {
        super(props);
        this.videoElement = React.createRef();
        this.videoWrapperElement = React.createRef();
        this.state = {
            error: '',
        }
    };

    static defaultProps = {
        hostIP: API_CONFIG.hostname,
        overlayOptions: {
            preserveDrawingBuffer: true,
        }
    };

    connectToFrameSocket = async (url: string) => {
        let canvasElement = this.videoElement.current!;

        // if (this.ws?.OPEN) {
        //     this.ws.close()
        // }

        // this.ws = new WebSocket(`${this._videoUrl}/${this.props.videoPath}`);
        // let ctx = canvasElement?.getContext('2d');
        // let img = new Image();
        // this.ws.onopen = () => {
        //     this.setState({ error: '' });
        //     this.ws!.onmessage = (event) => {
        //         let dataUrl = URL.createObjectURL(new Blob([event.data], { type: 'image/jpeg' }));
        //         img.onload = () => {
        //             canvasElement.width = img.width;
        //             canvasElement.height = img.height;
        //             ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height)
        //             ctx?.drawImage(img, 0, 0)
        //             URL.revokeObjectURL(dataUrl)
        //         }
        //         img.src = dataUrl
        //     }
        // }
        // this.ws.onerror = (event) => {
        //     console.log('JSMPEG Player:', 'ws error', event);
        //     this.setState({ error: 'Error in connecting to WebSocket!' })
        // }

        //   useEffect(() => {
        // let clientInst: Client
        // if (!camera) {
        //   setError(t('FAILED_GET_CAMERA'))
        //   return
        // }

        // setError(t('FAILED_GET_CAMERA'))
        // console.log("connectToFrameSocket VRod", API_CONFIG.websocket)
        let rejectPromise;

        try {
            const connectionPromise = new Promise((resolve, reject) => {
                rejectPromise = reject;

                let clientInst = new Client({
                    brokerURL: API_CONFIG.websocket,
                    connectHeaders: {
                        login: "admin",
                        passcode: "admin"
                    },
                    onConnect() {
                        resolve(
                            clientInst.subscribe(`/queue/${url}`, message => {
                                // console.log('Error in initializing client',message.body)
                                let ctx = canvasElement?.getContext('2d');
                                let img = new Image();
                                let dataUrl = `data:image/jpeg;base64,${message.body}`;// URL.createObjectURL(new Blob([message.body], { type: 'image/jpeg' }));
                                img.onload = () => {
                                    canvasElement.width = img.width;
                                    canvasElement.height = img.height;
                                    ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height)
                                    ctx?.drawImage(img, 0, 0)
                                    URL.revokeObjectURL(dataUrl)
                                }
                                img.src = dataUrl
                            })
                        );
                    },
                    onStompError(frame) {
                        reject(new Error('Error in connecting to rabbit!'));
                    },
                    onWebSocketError(event) {
                        reject(new Error('Error in connecting to rabbit!'));
                    }
                });

                clientInst.activate();
            });

            await connectionPromise;
        } catch (error) {
            console.log('Error in initializing client', error);
            this.setState({ error: 'Error in initializing jsmpeg player' });
        }

        // try {


        //     let clientInst = new Client({
        //         brokerURL: API_CONFIG.websocket,
        //         connectHeaders: {
        //             login: "admin",
        //             passcode: "admin"
        //         },
        //         onConnect() {
        //             clientInst.subscribe(`/queue/${url}`, message => {
        //                 let ctx = canvasElement?.getContext('2d');
        //                 let img = new Image();
        //                 let dataUrl = `data:image/jpeg;base64,${message.body}`;// URL.createObjectURL(new Blob([message.body], { type: 'image/jpeg' }));
        //                 img.onload = () => {
        //                     canvasElement.width = img.width;
        //                     canvasElement.height = img.height;
        //                     ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height)
        //                     ctx?.drawImage(img, 0, 0)
        //                     URL.revokeObjectURL(dataUrl)
        //                 }
        //                 img.src = dataUrl
        //             })
        //         },
        //         onStompError(frame) {
        //             console.log('rabbit connection error', frame);

        //             throw new Error('Error in connecting to rabbit!')
        //             // setState({ error: 'Error in connecting to rabbit!' })
        //             // setError(t('WEBSOCKET_ERROR'));
        //             // setConnectionStatus('Connecting');
        //         },
        //         onWebSocketError(event) {
        //             console.log('webSocket error', event);
        //             reject(new Error('Error in connecting to rabbit!'));
        //             // setState({ error: 'Error in initializing jsmpeg player' })
        //             // throw new Error('Error in connecting to rabbit!')
        //             // setState({ error: 'Error in connecting to rabbit!' })
        //             // setError(t('WEBSOCKET_ERROR'));
        //             // setConnectionStatus('Connecting');
        //         }
        //     })
        //     clientInst.activate()
        //     new Promise((resolve, reject) => {
        //         // در اینجا می‌توانید reject را به callbackها پاس دهید
        //         // یا از متغیر بیرونی reject استفاده کنید
        //     });
        // } catch (error) {
        //     console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrror', error);
        //     this.setState({ error: 'Error in initializing jsmpeg player' })
        // }


        // clientInst.deactivate()

        // -------------------------------------------------------------------------------

    }

    initPlayer() {
        // if (!isWSLink(this._videoUrl)) {
        //     this.setState({ error: this.props.t?.('WS link is invalid!') ?? '' })
        //     return
        // }

        try {
            if (this.props.picMode) {
                this.connectToFrameSocket(this.rtsp!)
            } else {
                // console.log("ddddddddddddddddddddddddd")
                this.videoInstanceRef = new JSMpeg.VideoElement(
                    this.videoElement.current,
                    this._videoUrl,
                    this.props.options,
                    this.props.overlayOptions
                );
            }
            // this.setState({ playing: this.videoInstanceRef.paused })
        } catch (err: any) {
            console.log("ggggggggggggggggggggggggggggggg", err)
            this.setState({ error: err.message ?? 'Error in initializing jsmpeg player' })
        }
    }

    componentDidMount() {
        if (this.props.socketPort) {
            this.props?.canvasRef?.(this.videoElement.current!);
            this.initPlayer()
        }
        else
            this.setState({ error: `! The socket port number is empty` })
    };

    componentDidUpdate(prevProps: Readonly<IProps>): void {
        if ((prevProps.socketPort !== this.props.socketPort && this.props.socketPort) || (prevProps.videoPath !== this.props.videoPath)) {
            this.initPlayer()
        }
    }

    componentWillUnmount(): void {
        if (this.videoInstanceRef)
            try {
                this.videoInstanceRef.destroy?.();
            } catch (err) { }
    }

    handleClickVideoWrapper = (e: React.MouseEvent<HTMLDivElement>) => {
        if (document.fullscreenElement)
            this.handleStopPropagation(e)
    }

    handleStopPropagation = (e) => {
        e.stopPropagation();
    };

    // handleTogglePlay = () => {
    //     const player = this.videoInstanceRef
    //     player.paused ? player.play() : player.pause();
    //     this.setState({ playing: !this.state.playing })
    // }

    handleSnapShot = () => {
        try {
            const canvas = this.props.picMode ? this.videoElement.current : this.videoInstanceRef.els.canvas;
            let dataURL = canvas.toDataURL();
            if (dataURL) {
                const anchorEl = document.createElement('a');
                anchorEl.download = 'snap-shot';
                anchorEl.href = dataURL
                anchorEl.click();
            } else throw new Error('snapshot: dataURL is empty!')
        } catch (err) {
            console.log(err);
        }
    }

    handleToggleFullScreen = () => {
        if (document.fullscreenElement)
            document?.exitFullscreen()
        else
            this.videoWrapperElement.current?.requestFullscreen()
    }

    render() {
        const { error } = this.state;
        const {
            onRecordStart,
            onRecordStop,
            recording,
        } = this.props;

        if (error)
            return (
                <div className={classes.noSignalContainer} >
                    <p>
                        {error}
                    </p>
                </div>
            )
        return (
            <div
                className={classes.container}
                ref={this.videoWrapperElement}
                onClick={this.handleClickVideoWrapper}
            >
                <canvas
                    className={classes.videoElement}
                    ref={this.videoElement}
                />

                {recording &&
                    <div className={classes.recordingTag}  >
                        <FiberManualRecordIcon color='error' fontSize='small' />
                        <span >recording...</span>
                    </div>}

                <div className={classes.controllers} onClick={this.handleStopPropagation} >
                    <IconButton onClick={this.handleSnapShot} >
                        <CameraAltIcon />
                    </IconButton>
                    <IconButton onClick={this.handleToggleFullScreen}>
                        <FullscreenIcon />
                    </IconButton>
                    {onRecordStart &&
                        <IconButton onClick={recording ? onRecordStop : onRecordStart}>
                            {recording ? <StopCircleIcon /> : <RadioButtonCheckedIcon />}
                        </IconButton>}
                </div>

            </div>)
    }
};

export default WithRecorder(withTranslation('PLATE_DETECTION')<ComponentType<IProps>>(CameraVideoPlayer))
