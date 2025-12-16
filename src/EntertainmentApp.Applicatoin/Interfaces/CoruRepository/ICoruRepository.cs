using EntertainmentApp.Domain.Entities;

namespace EntertainmentApp.Applicatoin.Interfaces.CoruRepository
{
    public interface ICoruRepository
    {
        public Task<Coru> AddCoruAsync(Coru coru);
        public Task<Coru> GetCoruByIdAsync(Guid id);
        public Task<List<Coru>> GetAllCorusAsync();
        public Task DeleteCoruAsync(Coru cour);
    }
}
