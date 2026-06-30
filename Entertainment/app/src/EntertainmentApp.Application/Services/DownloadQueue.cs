namespace EntertainmentApp.Application.Services
{
    public class DownloadQueue : IDownloadQueue
    {
        //private readonly ConcurrentQueue<DownloadItem> _queue = new();
        private readonly ConcurrentQueue<DownloadItem> _priorityQueue = new();
        private readonly ConcurrentQueue<DownloadItem> _normalQueue = new();
        private readonly HashSet<string> _keys = new();

        private string GetKey(DownloadItem item) => $"{item.Type}:{item.Id}";

        public void Enqueue(DownloadItem item)
        {
            var key = GetKey(item);

            lock (_keys)
            {
                if (_keys.Contains(key)) return;
                if (item.CurrentlyDownload)
                    _priorityQueue.Enqueue(item);
                else
                    _normalQueue.Enqueue(item);

                _keys.Add(key);
            }
        }

        public bool TryDequeue(out DownloadItem item)
        {
            // 1. Try priority queue first
            if (_priorityQueue.TryDequeue(out item))
            {
                RemoveKey(item);
                return true;
            }

            // 2. Then normal queue
            if (_normalQueue.TryDequeue(out item))
            {
                RemoveKey(item);
                return true;
            }

            return false;
        }

        public DownloadItem GetCurrentlyDownload()
        {
            _priorityQueue.TryPeek(out var item);
            return item;
        }

        private void RemoveKey(DownloadItem item)
        {
            lock (_keys)
            {
                _keys.Remove(GetKey(item));
            }
        }
    }

}
