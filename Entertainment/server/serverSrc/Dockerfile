# -----------------------
# 1. Build stage
# -----------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src



# Copy solution and restore
COPY *.sln .
COPY Entertainment.Server.API/Entertainment.Server.API.csproj Entertainment.Server.API/
COPY Entertainment.Server.Application/Entertainment.Server.Application.csproj Entertainment.Server.Application/
COPY Entertainment.Server.Infrustructure/Entertainment.Server.Infrustructure.csproj Entertainment.Server.Infrustructure/
COPY Entertainment.Server.Domain/Entertainment.Server.Domain.csproj Entertainment.Server.Domain/

RUN dotnet restore 

# Copy everything else
COPY . .

# Publish the app
WORKDIR /src/Entertainment.Server.API
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
EXPOSE 5031

# Set environment
ENV ASPNETCORE_URLS=http://+:5031
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "Entertainment.Server.API.dll"]