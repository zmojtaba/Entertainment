using EntertainmentApp.Applicatoin.Interfaces.CoruRepository;
using EntertainmentApp.Domain.Entities;

namespace EntertainmentApp.Infrastructure.Repository
{
    public class CoruRepositroy : ICoruRepository
    {
        private readonly ApplicationDBContext _context;
        public CoruRepositroy(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<Coru> AddCoruAsync(Coru coru)
        {
            await _context.Corus.AddAsync(coru);
            await  _context.SaveChangesAsync();
            return coru;
        }

        public async Task DeleteCoruAsync(Coru coru)
        {
            _context.Remove(coru);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Coru>> GetAllCorusAsync()
        {
            return await _context.Corus.OrderByDescending(c => c.CreatedAt).ToListAsync();
        }

        public async Task<Coru?> GetCoruByIdAsync(Guid id)
        {
            return await _context.Corus.FindAsync(id);
        }
    }
}
