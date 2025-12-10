using EntertainmentApp.Domain.Entities.Account;
using EntertainmentApp.Domain.Entities.Shared;
using EntertainmentApp.Domain.Entities.Video;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EntertainmentApp.Infrastructure.Data
{
    public class ApplicationDBContext : IdentityDbContext<ApplicationUser>
    {
        private readonly IConfiguration _configuration;
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options, IConfiguration config) : base(options)
        {
            _configuration = config;
        }


        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Director> Directors { get; set; }  
        public DbSet<Actor> Actors { get; set; }



        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            List<IdentityRole> roleList = new List<IdentityRole>(){

                new IdentityRole{
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole{
                    Name = "User",
                    NormalizedName = "USER"
                }
            };


            builder.Entity<IdentityRole>().HasData(roleList);

            var adminUser = new ApplicationUser
            {
                UserName = _configuration["AdminUser:UserName"],
                NormalizedUserName = "ADMIN",
            };

            adminUser.PasswordHash = new PasswordHasher<ApplicationUser>().HashPassword(adminUser, _configuration["AdminUser:Password"]);

            builder.Entity<ApplicationUser>().HasData(adminUser);

            builder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                RoleId = roleList.Single(r => r.Name == "Admin").Id,
                UserId = adminUser.Id
            });


            builder.Entity<Movie>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.HasIndex(e => new { e.Title, e.PublishedDate }).IsUnique();
                entity.HasMany(e => e.Genres).WithMany(g => g.Movies);
                entity.HasMany(e => e.Actors).WithMany(a => a.Movies);
                entity.HasMany(e => e.Directors).WithMany(d => d.Movies);

            });

            builder.Entity<Genre>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Title).IsUnique();

            });

            builder.Entity<Actor>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
                entity.HasIndex(e => e.Name).IsUnique();
            });

            builder.Entity<Director>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
                entity.HasIndex(e => e.Name).IsUnique();
            });





        }
    }

}
