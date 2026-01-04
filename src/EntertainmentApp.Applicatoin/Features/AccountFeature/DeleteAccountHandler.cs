
using EntertainmentApp.Applicatoin.Interfaces.Account;
using EntertainmentApp.Domain.Entities.Account;

namespace EntertainmentApp.Applicatoin.Features.AccountFeature
{
    public record DeleteAccountCommand(string UserName) : ICommand;
    internal class DeleteAccountHandler(IAccountRepository accountRepository) : ICommandHandler<DeleteAccountCommand>
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
