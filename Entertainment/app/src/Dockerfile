# -----------------------
# 1. Build stage
# -----------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

RUN apt-get update && apt-get install -y ffmpeg

# Copy solution and restore
COPY *.sln .
COPY EntertainmentApp.API/EntertainmentApp.API.csproj EntertainmentApp.API/
COPY EntertainmentApp.Application/EntertainmentApp.Application.csproj EntertainmentApp.Application/
COPY EntertainmentApp.Infrastructure/EntertainmentApp.Infrastructure.csproj EntertainmentApp.Infrastructure/
COPY EntertainmentApp.Domain/EntertainmentApp.Domain.csproj EntertainmentApp.Domain/

RUN dotnet restore 

# Copy everything else
COPY . .

# Publish the app
WORKDIR /src/EntertainmentApp.API
RUN dotnet publish -c Release -o /app/publish

# -----------------------
# 2. Runtime stage
# -----------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install dependencies if needed (optional)
# RUN apt-get update && apt-get install -y ...

COPY --from=build /app/publish .

# Expose port (matches your Program.cs)
EXPOSE 5030

# Set environment
ENV ASPNETCORE_URLS=http://+:5030
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "EntertainmentApp.API.dll"]