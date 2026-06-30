
// import React, { useRef, useEffect, useState } from "react";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";

// const playerStyles = `
//   .video-container {
//     position: relative;
//     width: 70%;
//     margin: 0 auto;
//     background: #000;
//   }

//   .video-js {
//     width: 100% !important;
//     height: auto !important;
//   }

//   .vjs-control-bar {
//     bottom: 0 !important;
//   }

//   @media (max-width: 768px) {
//     .video-container {
//       width: 90% !important;
//       height: calc(100vh - 230px) !important;
//     }
//   }

//   @media (max-width: 896px) and (orientation: landscape) {
//     .video-container {
//       width: 50% !important;
//     }
//   }
// `;

// interface VideoSubtitle {
//   url: string;
//   lang?: string; // اختیاری است
//   label?: string; // اختیاری است
// }

// interface PlaylistItem {
//   url: string;
//   type?: string; // اختیاری است، چون پیش‌فرض "video/mp4" در نظر گرفته شده
//   subtitle?: VideoSubtitle; // اختیاری است
// }
// interface PrppsType {
//   playlist: PlaylistItem[],
//   play: boolean
// }

// const VideoJSPlayer = (props: PrppsType) => {
//   const { play = false, playlist } = props
//   const videoContainerRef = useRef(null);
//   const playerRef = useRef(null);
//   // console.log("playlist", playlist);

//   const [currentIndex, setCurrentIndex] = useState(1);

//   const currentVideo = playlist[0];

//   // 1. ساخت پلیر (فقط یک بار در زمان Mount)
//   useEffect(() => {
//     if (!videoContainerRef.current || playerRef.current) return;

//     // const videoElement = document.createElement("video-js");
//     // videoElement.classList.add("vjs-big-play-centered", "vjs-fluid");
//     // videoContainerRef.current.appendChild(videoElement);

//     const player = (playerRef.current = videojs(videoElement, {
//       controls: true,
//       playbackRates: [1, 2, 4, 8],
//       muted: true,
//       responsive: true,
//       fluid: true,
//       autoplay: play,
//       preload: "auto",
//       playsinline: true,
//       sources: [{ src: currentVideo?.url, type: "video/mp4" }],
//     }));

//     // player.on("ended", () => {
//     //   setCurrentIndex((prev) => (prev < playlist.length - 1 ? prev + 1 : 0));
//     // });

//     return () => {
//       if (player && !player.isDisposed()) {
//         player.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, []); // وابسته به متغیرها نیست چون فقط یکبار باید ساخته شود

//   // 2. تغییر سورس ویدیو (وقتی currentIndex تغییر می‌کند)
//   useEffect(() => {
//     if (!playerRef.current || !currentVideo) return;

//     playerRef.current.src({ src: currentVideo.url, type: "video/mp4" });
//     if (play) playerRef.current.play();
//   }, [currentIndex, currentVideo.url]);

//   // 3. مدیریت زیرنویس (وقتی ویدیو یا زیرنویس عوض می‌شود)
//   useEffect(() => {
//     if (!playerRef.current || !currentVideo) return;

//     const player = playerRef.current;

//     // پاک کردن زیرنویس‌های قبلی
//     const oldTracks = player.remoteTextTracks();
//     for (let i = oldTracks.length - 1; i >= 0; i--) {
//       player.removeRemoteTextTrack(oldTracks[i]);
//     }

//     // اضافه کردن زیرنویس جدید اگر وجود داشته باشد
//     if (currentVideo.subtitle) {
//       player.addRemoteTextTrack({
//         kind: "subtitles",
//         src: currentVideo.subtitle.url,
//         srclang: currentVideo.subtitle.lang || "fa",
//         label: currentVideo.subtitle.label || "Subtitle",
//         default: true,
//       }, false);
//     }
//   }, [currentIndex, currentVideo.subtitle]);

//   return (
//     <>
//       <style>{playerStyles}</style>
//       <div className="video-container" ref={videoContainerRef} />
//     </>
//   );
// };

// export default VideoJSPlayer;
import React from 'react'

function NetflixPlayer() {
  return (
    <div>NetflixPlayer</div>
  )
}

export default NetflixPlayer