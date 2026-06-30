using Entertainment.Server.Applicatoin.Interfaces.Account;
using Entertainment.Server.Domain.Entities.Account;

namespace Entertainment.Server.Applicatoin.Features.AccountFeature
{
    public record UsersLogInHistoryQuery() : IQuery<List<UserLoginHistory>>;
    public class UsersLoginHistoryHandlerr(
            IAccountRepository accountRepo) : IQueryHandler<UsersLogInHistoryQuery, List<UserLoginHistory>>
    {
        public async Task<List<UserLoginHistory>> Handle(UsersLogInHistoryQuery query, CancellationToken cancellationToken)
        {
            var histories = await accountRepo.GetAllUserLoginHistories();
            if (histories == null || histories.Count == 0)
            {
                throw new NotFoundException("No login history found.");
            }
            return histories;
        }
        
    }
}
