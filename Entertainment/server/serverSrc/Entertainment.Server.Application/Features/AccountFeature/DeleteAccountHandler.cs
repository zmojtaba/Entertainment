
using Entertainment.Server.Applicatoin.Interfaces.Account;
using Entertainment.Server.Domain.Entities.Account;

namespace Entertainment.Server.Applicatoin.Features.AccountFeature
{
    public record DeleteAccountCommand(string UserName) : ICommand;
    public class DeleteAccountHandler(IAccountRepository accountRepository) : ICommandHandler<DeleteAccountCommand>
    {
        public async Task<Unit> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
        {
            if (request.UserName.ToLower() == "admin")
            {
                throw new InvalidOperationException("Cannot delete the Admin account.");
            }
            ApplicationUser user = await accountRepository.GetAccountByUsernameAsync(request.UserName);
            if (user == null)
            {
                throw new NotFoundException($"User not found.");
            }
            await accountRepository.DeleteAsync(user);
            return Unit.Value;
        }
    }
}
