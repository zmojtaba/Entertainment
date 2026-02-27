namespace EntertainmentApp.Applicatoin.Interfaces
{
    public interface IHomeRepository
    {
        public Task<List<Genre>?> GetGenresAsync();
        public Task<Genre?> GetGenreAsync(string title);
        public Task<Genre> AddGenreAsync(Genre genre);
        public Task DeleteGenreAsync(Genre genre);
        public Task SaveChangesAsync();
    }
}
