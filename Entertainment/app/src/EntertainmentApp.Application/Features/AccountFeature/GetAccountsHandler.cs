using EntertainmentApp.Application.Interfaces.Account;
using EntertainmentApp.Domain.Entities.Account;


namespace EntertainmentApp.Application.Features.AccountFeature
{
    public record GetAccountsQuery() : IQuery<List<UserDto>>;

    public class GetAccountsHandler : IQueryHandler<GetAccountsQuery, List<UserDto>>
    {
        private readonly IAccountRepository _accountRepository;
        public GetAccountsHandler(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }
        public async Task<List<UserDto>> Handle(GetAccountsQuery request, CancellationToken cancellationToken)
        {
            List<ApplicationUser> users = await _accountRepository.GetAllUserAsync();

            List<UserDto> result = new List<UserDto>();

            foreach (var user in users)
            {
                var role = await _accountRepository.GetAccountRoleAsync(user);

                result.Add(user.ToUserDto(
                    accessToken: null,
                    role: role // or string.Join(",", roles)
                ));
            }

            return result;
        }
    }
}
