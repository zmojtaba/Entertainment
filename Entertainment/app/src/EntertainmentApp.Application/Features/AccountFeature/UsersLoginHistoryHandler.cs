using EntertainmentApp.Application.Interfaces.Account;
using EntertainmentApp.Domain.Entities.Account;

namespace EntertainmentApp.Application.Features.AccountFeature
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
