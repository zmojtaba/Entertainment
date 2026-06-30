import React, { useEffect, useRef, useState, type SourceHTMLAttributes } from 'react';
import classes from './style.module.scss'
import ReactPlayer from 'react-player';
type propsType = {
  videoSrc: string,
  subtitle: string,
  adSrc: string,
  play: boolean
}

const VideoPlayer = (props: propsType) => {
  const { videoSrc, subtitle, adSrc, play } = props
  const sourceRef = useRef(null)
  const playerRef = useRef<HTMLVideoElement>(null);
  const [showAd, setShowAd] = useState<boolean>(true);
  const [canSkip, setCanSkip] = useState<boolean>(false);

  // console.log('Subtitle',subtitle)

  useEffect(() => {
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      setCanSkip(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!playerRef.current) return;

    const internalPlayer = playerRef.current;
    internalPlayer.load();

  }, [videoSrc,showAd]);
  return (
    <>
      {showAd && canSkip &&
        <button
          onClick={() => setShowAd(!showAd)}
          style={{
            backgroundColor: 'orange',
            color: 'black',
            border: 'none',
            borderRadius: '10px',
            position: "absolute",
            bottom: 90,
            right: 20,
            zIndex: 10,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Reject the ad
        </button>
      }
      <ReactPlayer
        ref={playerRef}
        autoPlay
        width={'100%'}
        height={'100%'}
        controls={true}
        playing={play}
        //  config={{html:{ attributes: { crossOrigin: 'anonymous' } }}} 
        playsInline={true}
        crossOrigin='anonymous'
        webkit-playsinline="true"
        onEnded={() => setShowAd(false)}
      >
        <source src={showAd ? adSrc : videoSrc} />

        <track kind="subtitles" src={subtitle} default
        />

      </ReactPlayer>
    </>
  );
};

export default VideoPlayer;
