namespace Entertainment.Server.Applicatoin.Features.AccountFeature
{
    public record ResetPasswordCommand
        : ICommand<UserDto>
    {
        public string Username { get; set; } 
        public string Password { get; set; } 
        public string AdminAccessToken { get; set; }
    };

    public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
    {
        public ResetPasswordCommandValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username is required.");
            RuleFor(x => x.AdminAccessToken)
                .NotEmpty().WithMessage("AdminAccessToken is required.");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters.");
        }
    }
    public class ResetPasswordHandler(IAccountRepository accountRepo, ITokenService tokenService)
            : ICommandHandler<ResetPasswordCommand, UserDto>
    {
        public async Task<UserDto> Handle(ResetPasswordCommand command, CancellationToken cancellationToken)
        {

            var adminInfo = await tokenService.GetUserByToken(command.AdminAccessToken);
            if (adminInfo.Role != "Admin")
                throw new BadRequestException("Only Admins can create new accounts");
            ApplicationUser adminUser = await accountRepo.GetAccountByUsernameAsync(adminInfo.UserName);
            if (adminUser == null)
                throw new BadRequestException("Admin user not found");

            ApplicationUser? appUser = await accountRepo.GetAccountByUsernameAsync(command.Username);
            if (appUser == null) throw new NotFoundException("Username not found.");

            var resetResult = await accountRepo.ResetPasswordAsync(appUser, command.Password);
            if (!resetResult.Succeeded)
            {
                throw new BadRequestException(string.Join(", ", resetResult.Errors.Select(e => e.Description)));
            }
            string role = await accountRepo.GetAccountRoleAsync(appUser);
            string accessToken = tokenService.CreateAccessToken(appUser, role);
            string refreshToken = tokenService.CreateRefreshToken(appUser);
            appUser.RefreshToken = refreshToken;
            await accountRepo.UpdateUserAsync(appUser);
            return appUser.ToUserDto(accessToken, role);
        }
    }
}
