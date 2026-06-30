// @ts-nocheck
// @ts-ignore
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';

// اگر از styled-system یا tailwind استفاده نمی‌کنی، می‌تونی با div و css معمولی جایگزین کنی
// اینجا فقط برای مثال از div و style ساده استفاده کردم

const VideoPlayerTest = ({ source }) => {
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);

  // Play/Pause
  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  // Seek
  const seekForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
    }
  };

  const seekBackward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (playerContainerRef.current) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen((prev) => !prev);
  };

  // Picture-in-Picture
  const togglePictureInPicture = async () => {
    const player = playerRef.current?.getInternalPlayer();
    if (player && !isPip) {
      try {
        await player.requestPictureInPicture();
        setIsPip(true);
      } catch (error) {
        console.error('PiP failed:', error);
      }
    } else if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      setIsPip(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
        case 'k':
          handlePlayPause();
          e.preventDefault();
          break;
        case 'ArrowRight':
          seekForward();
          break;
        case 'ArrowLeft':
          seekBackward();
          break;
        case 'f':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={playerContainerRef}
      style={{
        // width: '100%',
        // maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        // background: '#000',
      }}
    >
      <ReactPlayer
        ref={playerRef}
        src={'http://localhost:5030/media/images/mov.mp4'}
        playing={playing}
        volume={volume}
        width="100%"
        height="100%"
        controls={true}
        onProgress={({ played }) => setPlayed(played)}
        onDuration={(dur) => setDuration(dur)}
        playsInline={true}
        // style={{ background: '#000' }}
      />

      {/* Custom Controls Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.7)',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          color: 'white',
        }}
      >
        {/* Progress Bar */}
        <input
          type="range"
          min={0}
          max={1}
          step="any"
          value={played}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            setPlayed(newValue);
            playerRef.current?.seekTo(newValue);
          }}
          style={{ width: '100%' }}
        />

        {/* Buttons Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={seekBackward} style={{ color: 'white', background: 'none', border: 'none' }}>
              ⏪ 10s
            </button>
            <button onClick={handlePlayPause} style={{ color: 'white', background: 'none', border: 'none', fontSize: '20px' }}>
              {playing ? '⏸ Pause' : '▶ Play'}
            </button>
            <button onClick={seekForward} style={{ color: 'white', background: 'none', border: 'none' }}>
              10s ⏩
            </button>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            {/* Volume */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔊</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ width: '80px' }}
              />
            </div>

            <button onClick={toggleFullscreen} style={{ color: 'white', background: 'none', border: 'none' }}>
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>

            <button onClick={togglePictureInPicture} style={{ color: 'white', background: 'none', border: 'none' }}>
              {isPip ? 'Exit PiP' : 'PiP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerTest;