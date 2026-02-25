import React, { useRef, useEffect, useState } from "react";
import videojs, { type VideoJsPlayer, type VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";

interface VideoItem {
  url: string;
  title?: string;
  subtitles?: { label: string; src: string }[];
}

interface VideoJSPlayerProps {
  playlist: VideoItem[];
  initialIndex?: number;
}

const VideoJSPlayer: React.FC<VideoJSPlayerProps> = ({
  playlist,
  initialIndex = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentVideo = playlist[currentIndex];

  useEffect(() => {
    if (!videoRef.current) return;

    const options: VideoJsPlayerOptions = {
      controls: true,
      responsive: true,
      fluid: true,
      autoplay: false,
      preload: "auto",
      sources: [
        {
          src: currentVideo.url,
          type: "video/mp4",
        },
      ],
      tracks: currentVideo.subtitles?.map((sub) => ({
        kind: "captions",
        label: sub.label,
        src: sub.src,
        default: true,
      })),
    };

    playerRef.current = videojs(videoRef.current, options);

    // Playlist: هنگام اتمام ویدئو بعدی پخش شود
    playerRef.current.on("ended", () => {
      if (currentIndex < playlist.length - 1) setCurrentIndex(currentIndex + 1);
      else setCurrentIndex(0);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [currentVideo, currentIndex, playlist]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js" />
      </div>

      {/* Playlist */}
      {playlist.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            gap: "10px",
          }}
        >
          {playlist.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                padding: "5px 10px",
                background: idx === currentIndex ? "#007bff" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {item.title || `Video ${idx + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoJSPlayer;
