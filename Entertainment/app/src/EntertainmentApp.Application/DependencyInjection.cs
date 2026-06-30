namespace EntertainmentApp.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            //services.AddMediatR(cfg =>
            //    cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
                cfg.AddOpenBehavior(typeof(MovieValidationCleanupBehavior<,>));
                cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
                cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
                
            });



            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddScoped<IDatabaseSyncService, DatabaseSyncService>();
            services.AddScoped<IDownloadQueueSyncService, DownloadQueuSyncService>();
            services.AddScoped<IVideoDatabaseSync, VideoDatabaseSync>();
            services.AddScoped<IMusicDatabaseSync, MusicDatabaseSync>();
            services.AddScoped<IStoryDtabaseSync, StoryDtabaseSync>();
            services.AddScoped<IPublicationDatabaseSync, PublicationDatabaseSync>();
            services.AddScoped<ICoruDatabaseSync, CoruDatabaseSync>();

            services.AddSingleton<IDownloadQueue, DownloadQueue>();

            services.AddHostedService<SyncDownloadBackgroundService>();
            services.AddHostedService<DownloadWorker>();


            return services;
        }
    }
}
