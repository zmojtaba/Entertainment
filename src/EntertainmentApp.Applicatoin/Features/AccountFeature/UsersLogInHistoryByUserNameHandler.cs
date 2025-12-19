using EntertainmentApp.Applicatoin.Interfaces.Account;
using EntertainmentApp.Domain.Entities.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EntertainmentApp.Applicatoin.Features.AccountFeature
{
    public class UsersLogInHistoryByUserNameHandler
    {
        public record UsersLogInHistoryByUserNameQuery(string UserName) : IQuery<List<UserLoginHistory>>;
        public class UsersLogInHistoryByUserNameQueryHandler(
            IAccountRepository accountRepo) : IQueryHandler<UsersLogInHistoryByUserNameQuery, List<UserLoginHistory>>
        {
            public async Task<List<UserLoginHistory>> Handle(UsersLogInHistoryByUserNameQuery query, CancellationToken cancellationToken)
            {
                if (string.IsNullOrEmpty(query.UserName))
                {
                    throw new BadRequestException("Username must be provided.");
                }
                var histories = await accountRepo.GetUserLoginHistories(query.UserName);
                if (histories == null || histories.Count == 0)
                {
                    throw new NotFoundException("No login history found for the specified username.");
                }
                return histories;
            }
        }
    }
}
