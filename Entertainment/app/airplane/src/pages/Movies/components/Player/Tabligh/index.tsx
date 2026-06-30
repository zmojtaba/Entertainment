import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayerTbligh = () => {
    const [showAd, setShowAd] = useState<boolean>(true);
    const [canSkip, setCanSkip] = useState<boolean>(false);

    useEffect(() => {
        const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
            setCanSkip(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ position: "relative" }}>
            {showAd &&
                <button
                    onClick={() => setShowAd(!showAd)}
                    style={{

                        backgroundColor: 'orange',
                        color: 'black',
                        border: 'none',
                        borderRadius: '10px',
                        position: "absolute",
                        bottom: 10,
                        right: 20,
                        zIndex: 10,
                        padding: "8px 12px",
                        cursor: "pointer",
                    }}
                >
                    Reject the ad
                </button>
            }
            {showAd ? (
                <>
                    <ReactPlayer
                        // url="/ad.mp4"
                        playing
                        width="100%"
                        height="100%"
                        onEnded={() => setShowAd(false)}
                    >
                        <source src="http://localhost:3000/test.mp4" />
                    </ReactPlayer>

                    {/* {canSkip && (
            <button
              onClick={() => setShowAd(false)}
              style={{
                backgroundColor:'orange',
                color:'black',
                border:'none',
                borderRadius:'10px',
                position: "absolute",
                bottom: 20,
                right: 20,
                zIndex: 10,
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
            Reject the ad
            </button>
          )} */}
                </>
            )
                :
                <ReactPlayer
                    //   playing
                    controls
                    width="100%"
                    style={{ height: '100%' }}
                //   style={{minWidth:'100% !important'}}
                //   height="100px"
                >
                    <source src="http://localhost:3000/d.mp4" />
                </ReactPlayer>
            }
        </div>
    );
};

export default VideoPlayerTbligh;