namespace Entertainment.Server.Applicatoin.Features.AccountFeature
{
    public record RegisterAccountCommand : ICommand<UserDto>
    {
        public string UserName { get; set; }
        public string Password { get; set; }

        public string ConfirmPassword { get; set; }

        public string Role { get; set; }

        public string AdminAccessToken { get; set; }
    }
    public class RegisterAccountCommandValidator : AbstractValidator<RegisterAccountCommand>
    {
        private static readonly string[] AllowedRoles = { "Admin", "User" };
        public RegisterAccountCommandValidator()
        {

            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Username is required.");


            RuleFor(x => x.AdminAccessToken)
                .NotEmpty().WithMessage("AdminAccessToken is required.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters.");

            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("Confirm password is required.")
                .Equal(x => x.Password)
                .WithMessage("Password and Confirm Password must match.");
                
            RuleFor(x => x.Role)
                .NotEmpty()
                .Must(role => AllowedRoles.Contains(role, StringComparer.OrdinalIgnoreCase))
                .WithMessage("Role must be either Admin or User.");
        }
    }


    public class RegisterAccountHandler(IAccountRepository accountRepo, ITokenService tokenService)
            : ICommandHandler<RegisterAccountCommand, UserDto>
    {

        public async Task<UserDto> Handle(RegisterAccountCommand command, CancellationToken cancellationToken)
        {

            if (tokenService.IsTokenExpired(command.AdminAccessToken))
                throw new BadRequestException("You must log in before");

            var adminInfo = await tokenService.GetUserByToken(command.AdminAccessToken);
            if (adminInfo.Role != "Admin")
                throw new BadRequestException("Only Admins can create new accounts");
            ApplicationUser adminUser = await accountRepo.GetAccountByUsernameAsync(adminInfo.UserName);
            if (adminUser == null)
                throw new BadRequestException("Admin user not found");

            command.Role = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(command.Role);
            ApplicationUser user = await accountRepo.GetAccountByUsernameAsync(command.UserName);
            if (user != null) throw new BadRequestException("This Username already exists");

            ApplicationUser newUser = new ApplicationUser
            {
                UserName = command.UserName,
            };

            var createResult = await accountRepo
                .CreateAccountAsync(newUser, command.Password);

            if (!createResult.Succeeded)
                throw new BadRequestException(
                    string.Join(", ", createResult.Errors.Select(e => e.Description))
                );

            // Assign role
            var roleResult = await accountRepo
                .AddToRoleAsync(newUser, command.Role);

            if (!roleResult.Succeeded)
            {
                // Rollback user creation
                await accountRepo.DeleteAsync(newUser);

                throw new BadRequestException(
                    string.Join(", ", roleResult.Errors.Select(e => e.Description))
                );
            }

            string accessToken = tokenService.CreateAccessToken(newUser, command.Role);
            string refreshToken = tokenService.CreateRefreshToken(newUser);
            newUser.RefreshToken = refreshToken;
            await accountRepo.UpdateUserAsync(newUser);



            return newUser.ToUserDto(accessToken, command.Role);
        }
        
    }
}
