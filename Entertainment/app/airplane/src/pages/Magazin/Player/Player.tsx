"use client";

import { useState } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const playlist = [
  {
    src: "http://10.211.47.233:5030/media/relaxi.mp3",
    title: "آهنگ اول",
    artist: "خواننده ۱",
  },
  {
    src: "http://10.211.47.233:5030/media/relaxi.mp3",
    title: "آهنگ دوم",
    artist: "خواننده ۲",
  },
  {
    src: "http://10.211.47.233:5030/media/relaxi.mp3",
    title: "آهنگ سوم",
    artist: "خواننده ۳",
  },
];

export default function PlaylistMusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const handleClickNext = () => {
    setCurrentTrackIndex((prev) =>
      prev < playlist.length - 1 ? prev + 1 : 0
    );
  };

  const handleClickPrevious = () => {
    setCurrentTrackIndex((prev) =>
      prev > 0 ? prev - 1 : playlist.length - 1
    );
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-br from-zinc-900 to-black rounded-2xl shadow-2xl border border-zinc-700">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        پلی‌لیست من
      </h2>

      <AudioPlayer
        src={playlist[currentTrackIndex].src}
        autoPlayAfterSrcChange={true}
        showSkipControls={true}
        showJumpControls={true}
        onClickPrevious={handleClickPrevious}
        onClickNext={handleClickNext}
        onEnded={handleClickNext} // وقتی آهنگ تموم شد بره بعدی
        customControlsSection={[
          RHAP_UI.MAIN_CONTROLS,
          RHAP_UI.LOOP,
          RHAP_UI.VOLUME,
        ]}
        customProgressBarSection={[
          RHAP_UI.CURRENT_TIME,
          RHAP_UI.PROGRESS_BAR,
          RHAP_UI.DURATION,
        ]}
        style={{
          boxShadow: 'none',
          background: 'transparent',
          color: '#e5e7eb',
        }}
      />

      {/* نمایش اطلاعات آهنگ فعلی */}
      <div className="mt-6 text-center">
        <h3 className="text-xl font-semibold text-white">
          {playlist[currentTrackIndex].title}
        </h3>
        <p className="text-zinc-400">
          {playlist[currentTrackIndex].artist}
        </p>
      </div>
    </div>
  );
}