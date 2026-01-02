


using EntertainmentApp.Applicatoin.Interfaces;
using EntertainmentApp.Applicatoin.Interfaces.Account;
using EntertainmentApp.Applicatoin.Interfaces.CoruRepository;
using EntertainmentApp.Infrastructure.Repository;

namespace EntertainmentApp.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IAudioPlayerService, AudioPlayerService>();
            
            services.AddScoped<IMediaService, MediaService>();
            services.AddScoped<IMovieRepository, MovieRepository>();
            services.AddScoped<ISeriesRepository, SeriesRepository>();
            services.AddScoped<ICoruRepository, CoruRepositroy>();
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IStoryRepository, StoryRepository>();
            services.AddScoped<IMusicRepository, MusicRepository>();
            services.AddScoped<IPublicationRepository, PublicationRepository>();
            services.AddScoped<ITokenService, TokenService>();

            // Use MySQL
            var connectionString = configuration.GetConnectionString("DefaultConnection") ?? "Server=localhost;Port=3306;Database=BookStoreDb;User=root;Password=password;";

            services.AddDbContext<ApplicationDBContext>(
                    options => options.UseNpgsql(connectionString)
                    );


            // Identity configuration

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 8;
            }).AddEntityFrameworkStores<ApplicationDBContext>().AddDefaultTokenProviders(); ;

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme =
                options.DefaultChallengeScheme =
                options.DefaultForbidScheme =
                options.DefaultScheme =
                options.DefaultSignInScheme =
                options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = configuration["JWT:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = configuration["JWT:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        System.Text.Encoding.UTF8.GetBytes(configuration["JWT:SigningKey"])
                    )

                };
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        var claims = context.Principal.Claims;
                        var tokenTypeClaim = claims.FirstOrDefault(c => c.Type == "token_type")?.Value;

                        // Check if the token type is "access_token"
                        if (tokenTypeClaim != "access_token")
                        {
                            context.Fail("Unauthorized"); // Reject the token if it's not an access token
                        }

                        return Task.CompletedTask;
                    }
                };


            });

            services.AddHttpContextAccessor();




            return services;
        }
    }
}
