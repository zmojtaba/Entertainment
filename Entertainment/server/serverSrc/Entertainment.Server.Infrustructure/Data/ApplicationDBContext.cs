namespace Entertainment.Server.Infrastructure.Data
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

        public DbSet<AudioStory> AudioStories { get; set; }
        public DbSet<AudioStoryEpisode> AudioStoryEpisodes { get; set; }

        public DbSet<Singer> Singers { get; set; }
        public DbSet<Track> Tracks { get; set; }
        public DbSet<Album> Albums { get; set; }
        public DbSet<AlbumEpisode> AlbumEpisodes { get; set; }

        public DbSet<Publisher> Publishers { get; set; }
        public DbSet<NewsPaper> NewsPapers { get; set; }
        public DbSet<Magazine> Magazines { get; set; }


        //public DbSet<Narrator> Narrators { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Series>(entity =>
            {
                entity.HasKey(e => e.Id);
                //entity.HasIndex(e => new { e.Title, e.PublishedDate }).IsUnique();
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
                //entity.HasIndex(e => new { e.SeriesId, e.SeasonNumber }).IsUnique();
                entity.HasMany(e => e.Episodes)
                .WithOne(episode => episode.Season)
                .HasForeignKey(episode => episode.SeasonId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Episode>(entity =>
            {
                entity.HasKey(e => e.Id);
                //entity.HasIndex(entity => new { entity.SeasonId, entity.EpisodeNumber }).IsUnique();
            });


            builder.Entity<Movie>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                //entity.HasIndex(e => new { e.Title, e.PublishedDate }).IsUnique();
                entity.HasMany(e => e.Genres).WithMany(g => g.Movies);
                entity.HasMany(e => e.Actors).WithMany(a => a.Movies);
                entity.HasMany(e => e.Directors).WithMany(d => d.Movies);
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
            });


            builder.Entity<AudioStory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasMany(e => e.Genres).WithMany(g => g.AudioStories);
                entity.HasMany(e => e.Speakers).WithMany(a => a.AudioStories);
                entity.HasMany(e => e.Episodes)
                .WithOne(episode => episode.AudioStory)
                .HasForeignKey(episode => episode.AudioStoryId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<AudioStoryEpisode>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            builder.Entity<Speaker>(entity =>
            {
                entity.HasKey(e => e.Name);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
                entity.HasIndex(e => e.Name).IsUnique();
            });

            builder.Entity<Singer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.HasMany(e => e.Tracks).WithOne(t => t.Singer).HasForeignKey(t => t.SingerId).OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(e => e.Albums).WithOne(a => a.Singer).HasForeignKey(a => a.SingerId).OnDelete(DeleteBehavior.Cascade);
            });



            builder.Entity<Track>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.HasMany(e => e.Genres).WithMany(g => g.Tracks);
            });

            builder.Entity<Album>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasMany(e => e.Genres).WithMany(g => g.Albums);
                entity.HasMany(e => e.Episodes)
                .WithOne(episode => episode.Album)
                .HasForeignKey(episode => episode.AlbumId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<AlbumEpisode>(entity =>
            {
                entity.HasKey(e => e.Id);
            });


            builder.Entity<Publisher>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.HasMany(e => e.NewsPapers).WithOne(n => n.Publisher).HasForeignKey(n => n.PublisherId).OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(e => e.Magazines).WithOne(m => m.Publisher).HasForeignKey(m => m.PublisherId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<NewsPaper>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasMany(e => e.Genres).WithMany(g => g.NewsPapers);
            });
            builder.Entity<Magazine>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasMany(e => e.Genres).WithMany(g => g.Magazines);
            });


        }
    }

}
