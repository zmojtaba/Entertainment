namespace Entertainment.Server.Applicatoin.Features.AccountFeature
{
    public record UsersLogInHistoryByUserNameQuery(string UserName) : IQuery<List<UserLoginHistory>>;
    public class UsersLogInHistoryByUserNameHandler(
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
