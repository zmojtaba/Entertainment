using NAudio.Wave;

namespace Entertainment.Server.Infrastructure.Services
{
    public class AudioPlayerService : IAudioPlayerService
    {
        private WaveOutEvent? _player;
        private AudioFileReader? _audio;
        private readonly object _lock = new();

        public void Play(string path)
        {
            lock (_lock)
            {
                Stop();

                _audio = new AudioFileReader(path);
                _player = new WaveOutEvent();
                _player.Init(_audio);
                _player.Play();
            }
        }

        public void Stop()
        {
            lock (_lock)
            {
                _player?.Stop();
                _player?.Dispose();
                _audio?.Dispose();

                _player = null;
                _audio = null;
            }
        }
    }
}
