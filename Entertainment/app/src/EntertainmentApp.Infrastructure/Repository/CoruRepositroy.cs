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

        public async Task UpdateCoruAsync(Coru coru)
        {
            _context.Corus.Update(coru);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Guid>> GetNotExistCorusId(List<Guid> ids)
        {
            var existingIds = await _context.Corus
                .Where(m => ids.Contains(m.Id))
                .Select(m => m.Id)
                .ToListAsync();

            var notExistingIds = ids.Except(existingIds).ToList();

            return notExistingIds;
        }
        public async Task<List<Guid>> GetNotExistOnSeverCorusId(List<Guid> ids)
        {
            var serverIds = await _context.Corus
                .Select(m => m.Id)
                .ToListAsync();

            return serverIds.Except(ids).ToList();
        }

        public async Task<List<Coru>> GetCorusNeedToDownloadAsync()
        {
            var excludedStatuses = new[]
            {
                DownloadStatus.NotNeed,
                DownloadStatus.Completed
            };

            return await _context.Corus
                .Where(x => !excludedStatuses.Contains(x.DownloadStatus))
                //.Select(x => x.Id)
                .ToListAsync();
        }


    }
}
