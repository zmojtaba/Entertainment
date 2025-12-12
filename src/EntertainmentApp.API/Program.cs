using EntertainmentApp.Infrastructure;
using EntertainmentApp.Shared.Exceptions.Handler;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;




namespace EntertainmentApp.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.WebHost.UseKestrel(o => o.Limits.MaxRequestBodySize = null);



            // Configure Kestrel (the server) to allow large bodies (e.g., 500MB)
            builder.WebHost.ConfigureKestrel(serverOptions =>
            {
                serverOptions.Limits.MaxRequestBodySize = 1_024_288_000; // 500 MB
            });
            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                options.JsonSerializerOptions.DefaultIgnoreCondition =
                    System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
            });



            builder.Services.AddEndpointsApiExplorer();
            builder.WebHost.UseUrls("http://0.0.0.0:5030");

            //builder.Services.AddSwaggerGen();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Entertainment API", Version = "v1" });

                // Add JWT authentication to Swagger
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            });

            builder.Services.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = int.MaxValue;
                x.MultipartBoundaryLengthLimit = int.MaxValue;
                x.MultipartHeadersCountLimit = int.MaxValue;
                x.MultipartHeadersLengthLimit = int.MaxValue;
            });

            builder.Services.AddApplication();
            builder.Services.AddInfrastructure(builder.Configuration);


            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  policy =>
                                  {
                                      //policy.WithOrigins("http://localhost:3000",
                                      //                      "https://localhost:3000",
                                      //                   "http://192.168.152.2:3000",
                                      //                   "https://192.168.152.2:3000",
                                      //                   "http://localhost:5070"
                                      //                   )
                                      policy.AllowAnyOrigin()
                                            .AllowAnyHeader()
                                            .AllowAnyMethod();
                                  });
            });


            builder.Services.AddExceptionHandler<CustomExceptionHandler>();


            var app = builder.Build();
            app.UseCors(MyAllowSpecificOrigins);
            app.UseExceptionHandler(options => { });
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.MapControllers();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider("C://EnternainmentMedia"),
                RequestPath = "/media",
                ServeUnknownFileTypes = true // Optional, use carefully
            });

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                       ForwardedHeaders.XForwardedProto |
                       ForwardedHeaders.XForwardedHost
            });



            app.Run();
        }
    }
}
