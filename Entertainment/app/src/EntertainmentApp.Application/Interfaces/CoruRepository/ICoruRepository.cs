using EntertainmentApp.Domain.Entities;

namespace EntertainmentApp.Application.Interfaces.CoruRepository
{
    public interface ICoruRepository
    {
        public Task<Coru> AddCoruAsync(Coru coru);
        public Task<Coru> GetCoruByIdAsync(Guid id);
        public Task<List<Coru>> GetAllCorusAsync();
        public Task UpdateCoruAsync(Coru coru);
        public Task DeleteCoruAsync(Coru cour);

        public Task<List<Guid>> GetNotExistCorusId(List<Guid> ids);
        public Task<List<Guid>> GetNotExistOnSeverCorusId(List<Guid> ids);
        public Task<List<Coru>> GetCorusNeedToDownloadAsync();

    }
}
