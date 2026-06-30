namespace EntertainmentApp.Domain.Entities
{

    public abstract class BaseEntity
    {
        public Guid Id { get; protected set; }
        public DateTime CreatedAt { get; protected set; }
        public DateTime? UpdatedAt { get; protected set; }

        public DownloadStatus DownloadStatus { get; protected set; } = DownloadStatus.NotNeed;
        public string? DownloadErrorMessage { get; protected set; } = string.Empty;
        public bool? CurrentlyDownload {  get; protected set; } = false;
        public int? DownloadRetryCount { get; protected set; } = 0;



        public BaseEntity()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }

        public BaseEntity(Guid id)
        {
            Id = id;
            CreatedAt = DateTime.UtcNow;
        }
        public void SetDownloadErrorMessage(string message)
        {
            DownloadErrorMessage = message;
        }
        public void ChangeId(Guid id)
        {
            Id = id;
        }

        public void ChangeCurrentlyDownload(bool currentlyDown)
        {
            CurrentlyDownload = currentlyDown;
        }

        public void ChangeDownloadRetryCount(int retryCount)
        {
            if (retryCount < 0 || retryCount>3)  throw new ArgumentOutOfRangeException(nameof(retryCount));
            DownloadRetryCount = retryCount;
        }

        public void ChangeDownloadStatus(DownloadStatus status)
        {
            DownloadStatus = status;
        }

        public void UpdateModifiedDate()
        {
            UpdatedAt = DateTime.UtcNow;
        }

        public override bool Equals(object? obj)
        {
            if (obj is null) return false;
            if (obj is not BaseEntity other) return false;
            if (ReferenceEquals(this, other)) return true;
            return Id.Equals(other.Id);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }

        public static bool operator ==(BaseEntity? left, BaseEntity? right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(BaseEntity? left, BaseEntity? right)
        {
            return !Equals(left, right);
        }
    }
}
