using EntertainmentApp.Domain.Entities;
using EntertainmentApp.Domain.Entities.Account;
using EntertainmentApp.Domain.Entities.Shared;
using EntertainmentApp.Domain.Entities.Story;
using EntertainmentApp.Domain.Entities.Video;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EntertainmentApp.Infrastructure.Data
{
    public class ApplicationDBContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {
        }


        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<UserLoginHistory> UserLoginHistories { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Director> Directors { get; set; }  
        public DbSet<Actor> Actors { get; set; }
        public DbSet<Series> Series { get; set; }
        public DbSet<Season> Seasons { get; set; }
        public DbSet<Episode> Episodes { get; set; }
        public DbSet<Coru> Corus { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Writer> Writers { get; set; }
        public DbSet<Speaker> Speakers { get; set; }
        public DbSet<PodCast> PodCasts { get; set; }
        public DbSet<PodCastEpisode> PodCastEpisodes { get; set; }

        //public DbSet<Narrator> Narrators { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //List<IdentityRole> roleList = new List<IdentityRole>(){

            //    new IdentityRole{
            //        Name = "Admin",
            //        NormalizedName = "ADMIN"
            //    },
            //    new IdentityRole{
            //        Name = "User",
            //        NormalizedName = "USER"
            //    }
            //};


            //builder.Entity<IdentityRole>().HasData(roleList);

            //var adminUser = new ApplicationUser
            //{
            //    UserName = _configuration["AdminUser:UserName"],
            //    NormalizedUserName = "ADMIN",
            //};

            //adminUser.PasswordHash = new PasswordHasher<ApplicationUser>().HashPassword(adminUser, _configuration["AdminUser:Password"]);

            //builder.Entity<ApplicationUser>(entity =>
            //{
            //    entity.HasData(adminUser);
            //    entity.HasIndex(e => e.UserName).IsUnique();
            //});

            //builder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            //{
            //    RoleId = roleList.Single(r => r.Name == "Admin").Id,
            //    UserId = adminUser.Id
            //});

            builder.Entity<Series>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.Title, e.PublishedDate }).IsUnique();
                entity.HasMany(e => e.Genres).WithMany(g => g.Series);
                entity.HasMany(e => e.Actors).WithMany(a => a.Series);
                entity.HasMany(e => e.Directors).WithMany(d => d.Series);
                entity.HasMany(e => e.Seasons)
                .WithOne(season => season.Series)
                .HasForeignKey(season => season.SeriesId)
                .OnDelete(DeleteBehavior.Cascade); ;
            });


            builder.Entity<Season>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.SeriesId, e.SeasonNumber }).IsUnique();
                entity.HasMany(e => e.Episodes)
                .WithOne(episode => episode.Season)
                .HasForeignKey(episode => episode.SeasonId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Episode>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(entity => new { entity.SeasonId, entity.EpisodeNumber }).IsUnique();
            });


            builder.Entity<Movie>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.HasIndex(e => new { e.Title, e.PublishedDate }).IsUnique();
                entity.HasMany(e => e.Genres).WithMany(g => g.Movies);
                entity.HasMany(e => e.Actors).WithMany(a => a.Movies);
                entity.HasMany(e => e.Directors).WithMany(d => d.Movies);
                //entity.HasOne(e => e.Media).WithOne(Media => Media.Movie).HasForeignKey<Media>(m => m.MovieId)
                //        .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Genre>(entity =>
            {
                entity.HasKey(e => e.Title);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Title).IsUnique();

            });

            builder.Entity<Actor>(entity =>
            {
                entity.HasKey(e => e.Name);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
                entity.HasIndex(e => e.Name).IsUnique();
            });

            builder.Entity<Director>(entity =>
            {
                entity.HasKey(e => e.Name);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
                entity.HasIndex(e => e.Name).IsUnique();
            });

            builder.Entity<Coru>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            builder.Entity<Book>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.HasIndex(e => new { e.Title, e.PublishedDate }).IsUnique();
                entity.HasMany(e => e.Genres).WithMany(g => g.Books);
                entity.HasMany(e => e.Writers).WithMany(d => d.Books);
            });

            builder.Entity<Writer>(entity =>
            {
                entity.HasKey(e => e.Name);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
                entity.HasIndex(e => e.Name).IsUnique();
            });

            builder.Entity<PodCast>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasMany(e => e.Genres).WithMany(g => g.PodCasts);
                entity.HasMany(e => e.Speakers).WithMany(a => a.PodCasts);
                entity.HasMany(e => e.Episodes)
                .WithOne(episode => episode.PodCast)
                .HasForeignKey(episode => episode.PodCastId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<PodCastEpisode>(entity =>
            {
                entity.HasKey(e => e.Id);
                //entity.HasIndex(entity => new { entity.PodCastId, entity.Title }).IsUnique();
            });

            builder.Entity<Speaker>(entity =>
            {
                entity.HasKey(e => e.Name);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
                entity.HasIndex(e => e.Name).IsUnique();
            });


        }
    }

}
