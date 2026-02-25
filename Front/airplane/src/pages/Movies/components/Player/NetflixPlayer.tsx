// @ts-nocheck
// @ts-ignore
import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// CSS اضافی رو می‌تونی در فایل جداگانه بذاری یا اینجا inline کنی
const playerStyles = `
  .video-container {
    position: relative;
    width: 70%;
    // max-width: 100%;
    margin: 0 auto;
    background: #000;
  }

  // .video-js {
  //   width: 100% !important;
  //   height: auto !important;
  // }



    .video-js {
    //   // width: 90vw !important;
    //    height:calc(100vh - 230px) !important;
      //  object-fit: fill; /* یا contain بسته به نیاز */
    // }

    /* اگر می‌خوای controls همیشه پایین بمونه */
    .vjs-control-bar {
      bottom: 0 !important;
    }
  
    @media (max-width: 768px) {    
      .video-container {
    position: relative;
     height:calc(100vh - 230px) !important;
    width: 90%;
}}
        @media (max-width: 896px) and (orientation: landscape) and (max-device-width: 896px) {
  .video-container {
    position: relative;
    width: 50%;
}
        }


 
`;

const VideoJSPlayer = ({ playlist, initialIndex = 0, play = false }) => {
  const videoContainerRef = useRef(null);
  const playerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  const currentVideo = playlist[currentIndex];

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered", "vjs-fluid"); // vjs-fluid برای responsive

      videoContainerRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, {
        controls: true,
        controlBar:true,                          // یا false اگر سفارشی می‌خوای
        responsive: true,
        fullscreen: true,
        fluid: true,                       // ★ مهم برای responsive
        aspectRatio: "16:9",               // اگر ویدیوهایت نسبت ثابت دارن (می‌تونی دینامیک کنی)
        autoplay: play,
        preload: "auto",
        playsinline: true,
        nativeControlsForTouch: true,
        fill: true,                        // سعی می‌کنه container رو پر کنه
        sources: [{ src: currentVideo.url, type: "video/mp4" }],
      }));

      player.on("ended", () => {
        if (currentIndex < playlist.length - 1) setCurrentIndex(currentIndex + 1);
        else setCurrentIndex(0);
      });

      player.on("error", () => {
        console.error("Video.js Error:", player.error());
      });
    } else {
      playerRef.current.src({ src: currentVideo.url, type: "video/mp4" });
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [currentVideo.url, play]);

  return (
    <>
      <style>{playerStyles}</style> {/* CSS رو اینجا inject می‌کنیم */}

      <div className="video-container" ref={videoContainerRef}>
        <div data-vjs-player>
          {/* video-js اینجا ساخته می‌شه */}
        </div>
      </div>

      {playlist.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            gap: "12px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {playlist.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                padding: "8px 16px",
                background: idx === currentIndex ? "#007bff" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {item.title || `ویدیو ${idx + 1}`}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default VideoJSPlayer;