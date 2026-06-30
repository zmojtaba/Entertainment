using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EntertainmentApp.Infrastructure.Data
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Actors",
                columns: table => new
                {
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    ImagePath = table.Column<string>(type: "text", nullable: true),
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actors", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    RefreshToken = table.Column<string>(type: "text", nullable: true),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AudioStories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Languages = table.Column<List<string>>(type: "text[]", nullable: false),
                    AgeGroup = table.Column<int>(type: "integer", nullable: false),
                    PosterImageUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AudioStories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Languages = table.Column<List<string>>(type: "text[]", nullable: false),
                    AgeGroup = table.Column<int>(type: "integer", nullable: false),
                    Rating = table.Column<decimal>(type: "numeric", nullable: false),
                    PublishedDate = table.Column<int>(type: "integer", nullable: false),
                    StreamUrl = table.Column<string>(type: "text", nullable: false),
                    PosterImageUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Corus",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    StreamUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Corus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Directors",
                columns: table => new
                {
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    ImagePath = table.Column<string>(type: "text", nullable: true),
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Directors", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "Genres",
                columns: table => new
                {
                    Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Categories = table.Column<List<string>>(type: "text[]", nullable: true),
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.Title);
                });

            migrationBuilder.CreateTable(
                name: "Movies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Languages = table.Column<List<string>>(type: "text[]", nullable: false),
                    Countries = table.Column<List<string>>(type: "text[]", nullable: false),
                    AgeGroup = table.Column<int>(type: "integer", nullable: false),
                    ImdbRating = table.Column<decimal>(type: "numeric", nullable: false),
                    PublishedDate = table.Column<int>(type: "integer", nullable: false),
                    StreamUrl = table.Column<string>(type: "text", nullable: false),
                    PosterImageUrl = table.Column<string>(type: "text", nullable: false),
                    SubtitleUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PodCasts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Languages = table.Column<List<string>>(type: "text[]", nullable: false),
                    AgeGroup = table.Column<int>(type: "integer", nullable: false),
                    PosterImageUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PodCasts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Publishers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    ImagePath = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publishers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Series",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Languages = table.Column<List<string>>(type: "text[]", nullable: false),
                    Countries = table.Column<List<string>>(type: "text[]", nullable: false),
                    AgeGroup = table.Column<int>(type: "integer", nullable: false),
                    ImdbRating = table.Column<decimal>(type: "numeric", nullable: false),
                    PublishedDate = table.Column<int>(type: "integer", nullable: false),
                    PosterImageUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Series", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Singers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ImagePath = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Singers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Speakers",
                columns: table => new
                {
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    ImagePath = table.Column<string>(type: "text", nullable: true),
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Speakers", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "UserLoginHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false),
                    LoginTime = table.Column<long>(type: "bigint", nullable: false),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    IsSuccessful = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLoginHistories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Writers",
                columns: table => new
                {
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    ImagePath = table.Column<string>(type: "text", nullable: true),
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Writers", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    RoleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AudioStoryEpisodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    StreamUrl = table.Column<string>(type: "text", nullable: false),
                    AudioStoryId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AudioStoryEpisodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AudioStoryEpisodes_AudioStories_AudioStoryId",
                        column: x => x.AudioStoryId,
                        principalTable: "AudioStories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AudioStoryGenre",
                columns: table => new
                {
                    AudioStoriesId = table.Column<Guid>(type: "uuid", nullable: false),
                    GenresTitle = table.Column<string>(type: "character varying(100)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AudioStoryGenre", x => new { x.AudioStoriesId, x.GenresTitle });
                    table.ForeignKey(
                        name: "FK_AudioStoryGenre_AudioStories_AudioStoriesId",
                        column: x => x.AudioStoriesId,
                        principalTable: "AudioStories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AudioStoryGenre_Genres_GenresTitle",
                        column: x => x.GenresTitle,
                        principalTable: "Genres",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookGenre",
                columns: table => new
                {
                    BooksId = table.Column<Guid>(type: "uuid", nullable: false),
                    GenresTitle = table.Column<string>(type: "character varying(100)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookGenre", x => new { x.BooksId, x.GenresTitle });
                    table.ForeignKey(
                        name: "FK_BookGenre_Books_BooksId",
                        column: x => x.BooksId,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookGenre_Genres_GenresTitle",
                        column: x => x.GenresTitle,
                        principalTable: "Genres",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActorMovie",
                columns: table => new
                {
                    ActorsName = table.Column<string>(type: "character varying(150)", nullable: false),
                    MoviesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActorMovie", x => new { x.ActorsName, x.MoviesId });
                    table.ForeignKey(
                        name: "FK_ActorMovie_Actors_ActorsName",
                        column: x => x.ActorsName,
                        principalTable: "Actors",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActorMovie_Movies_MoviesId",
                        column: x => x.MoviesId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DirectorMovie",
                columns: table => new
                {
                    DirectorsName = table.Column<string>(type: "character varying(150)", nullable: false),
                    MoviesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DirectorMovie", x => new { x.DirectorsName, x.MoviesId });
                    table.ForeignKey(
                        name: "FK_DirectorMovie_Directors_DirectorsName",
                        column: x => x.DirectorsName,
                        principalTable: "Directors",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DirectorMovie_Movies_MoviesId",
                        column: x => x.MoviesId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GenreMovie",
                columns: table => new
                {
                    GenresTitle = table.Column<string>(type: "character varying(100)", nullable: false),
                    MoviesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GenreMovie", x => new { x.GenresTitle, x.MoviesId });
                    table.ForeignKey(
                        name: "FK_GenreMovie_Genres_GenresTitle",
                        column: x => x.GenresTitle,
                        principalTable: "Genres",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GenreMovie_Movies_MoviesId",
                        column: x => x.MoviesId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GenrePodCast",
                columns: table => new
                {
                    GenresTitle = table.Column<string>(type: "character varying(100)", nullable: false),
                    PodCastsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GenrePodCast", x => new { x.GenresTitle, x.PodCastsId });
                    table.ForeignKey(
                        name: "FK_GenrePodCast_Genres_GenresTitle",
                        column: x => x.GenresTitle,
                        principalTable: "Genres",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GenrePodCast_PodCasts_PodCastsId",
                        column: x => x.PodCastsId,
                        principalTable: "PodCasts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PodCastEpisodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    StreamUrl = table.Column<string>(type: "text", nullable: false),
                    PodCastId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PodCastEpisodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PodCastEpisodes_PodCasts_PodCastId",
                        column: x => x.PodCastId,
                        principalTable: "PodCasts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Magazines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Languages = table.Column<List<string>>(type: "text[]", nullable: false),
                    PublishedDate = table.Column<long>(type: "bigint", nullable: false),
                    StreamUrl = table.Column<string>(type: "text", nullable: false),
                    PosterImageUrl = table.Column<string>(type: "text", nullable: false),
                    PublisherId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Magazines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Magazines_Publishers_PublisherId",
                        column: x => x.PublisherId,
                        principalTable: "Publishers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NewsPapers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Languages = table.Column<List<string>>(type: "text[]", nullable: false),
                    PublishedDate = table.Column<long>(type: "bigint", nullable: false),
                    StreamUrl = table.Column<string>(type: "text", nullable: false),
                    PosterImageUrl = table.Column<string>(type: "text", nullable: false),
                    PublisherId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsPapers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NewsPapers_Publishers_PublisherId",
                        column: x => x.PublisherId,
                        principalTable: "Publishers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActorSeries",
                columns: table => new
                {
                    ActorsName = table.Column<string>(type: "character varying(150)", nullable: false),
                    SeriesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActorSeries", x => new { x.ActorsName, x.SeriesId });
                    table.ForeignKey(
                        name: "FK_ActorSeries_Actors_ActorsName",
                        column: x => x.ActorsName,
                        principalTable: "Actors",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActorSeries_Series_SeriesId",
                        column: x => x.SeriesId,
                        principalTable: "Series",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DirectorSeries",
                columns: table => new
                {
                    DirectorsName = table.Column<string>(type: "character varying(150)", nullable: false),
                    SeriesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DirectorSeries", x => new { x.DirectorsName, x.SeriesId });
                    table.ForeignKey(
                        name: "FK_DirectorSeries_Directors_DirectorsName",
                        column: x => x.DirectorsName,
                        principalTable: "Directors",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DirectorSeries_Series_SeriesId",
                        column: x => x.SeriesId,
                        principalTable: "Series",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GenreSeries",
                columns: table => new
                {
                    GenresTitle = table.Column<string>(type: "character varying(100)", nullable: false),
                    SeriesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GenreSeries", x => new { x.GenresTitle, x.SeriesId });
                    table.ForeignKey(
                        name: "FK_GenreSeries_Genres_GenresTitle",
                        column: x => x.GenresTitle,
                        principalTable: "Genres",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GenreSeries_Series_SeriesId",
                        column: x => x.SeriesId,
                        principalTable: "Series",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Seasons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SeasonNumber = table.Column<int>(type: "integer", nullable: false),
                    SeriesId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seasons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Seasons_Series_SeriesId",
                        column: x => x.SeriesId,
                        principalTable: "Series",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Albums",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Languages = table.Column<List<string>>(type: "text[]", nullable: false),
                    PosterImageUrl = table.Column<string>(type: "text", nullable: false),
                    SingerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Albums", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Albums_Singers_SingerId",
                        column: x => x.SingerId,
                        principalTable: "Singers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tracks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Languages = table.Column<List<string>>(type: "text[]", nullable: false),
                    StreamUrl = table.Column<string>(type: "text", nullable: false),
                    PosterImageUrl = table.Column<string>(type: "text", nullable: false),
                    SingerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tracks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tracks_Singers_SingerId",
                        column: x => x.SingerId,
                        principalTable: "Singers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AudioStorySpeaker",
                columns: table => new
                {
                    AudioStoriesId = table.Column<Guid>(type: "uuid", nullable: false),
                    SpeakersName = table.Column<string>(type: "character varying(150)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AudioStorySpeaker", x => new { x.AudioStoriesId, x.SpeakersName });
                    table.ForeignKey(
                        name: "FK_AudioStorySpeaker_AudioStories_AudioStoriesId",
                        column: x => x.AudioStoriesId,
                        principalTable: "AudioStories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AudioStorySpeaker_Speakers_SpeakersName",
                        column: x => x.SpeakersName,
                        principalTable: "Speakers",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PodCastSpeaker",
                columns: table => new
                {
                    PodCastsId = table.Column<Guid>(type: "uuid", nullable: false),
                    SpeakersName = table.Column<string>(type: "character varying(150)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PodCastSpeaker", x => new { x.PodCastsId, x.SpeakersName });
                    table.ForeignKey(
                        name: "FK_PodCastSpeaker_PodCasts_PodCastsId",
                        column: x => x.PodCastsId,
                        principalTable: "PodCasts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PodCastSpeaker_Speakers_SpeakersName",
                        column: x => x.SpeakersName,
                        principalTable: "Speakers",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookWriter",
                columns: table => new
                {
                    BooksId = table.Column<Guid>(type: "uuid", nullable: false),
                    WritersName = table.Column<string>(type: "character varying(150)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookWriter", x => new { x.BooksId, x.WritersName });
                    table.ForeignKey(
                        name: "FK_BookWriter_Books_BooksId",
                        column: x => x.BooksId,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookWriter_Writers_WritersName",
                        column: x => x.WritersName,
                        principalTable: "Writers",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GenreMagazine",
                columns: table => new
                {
                    GenresTitle = table.Column<string>(type: "character varying(100)", nullable: false),
                    MagazinesId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GenreMagazine", x => new { x.GenresTitle, x.MagazinesId });
                    table.ForeignKey(
                        name: "FK_GenreMagazine_Genres_GenresTitle",
                        column: x => x.GenresTitle,
                        principalTable: "Genres",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GenreMagazine_Magazines_MagazinesId",
                        column: x => x.MagazinesId,
                        principalTable: "Magazines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GenreNewsPaper",
                columns: table => new
                {
                    GenresTitle = table.Column<string>(type: "character varying(100)", nullable: false),
                    NewsPapersId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GenreNewsPaper", x => new { x.GenresTitle, x.NewsPapersId });
                    table.ForeignKey(
                        name: "FK_GenreNewsPaper_Genres_GenresTitle",
                        column: x => x.GenresTitle,
                        principalTable: "Genres",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GenreNewsPaper_NewsPapers_NewsPapersId",
                        column: x => x.NewsPapersId,
                        principalTable: "NewsPapers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Episodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EpisodeNumber = table.Column<int>(type: "integer", nullable: false),
                    StreamUrl = table.Column<string>(type: "text", nullable: false),
                    SubtitleUrl = table.Column<string>(type: "text", nullable: false),
                    SeasonId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Episodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Episodes_Seasons_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Seasons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AlbumEpisodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    StreamUrl = table.Column<string>(type: "text", nullable: false),
                    AlbumId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlbumEpisodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlbumEpisodes_Albums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "Albums",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AlbumGenre",
                columns: table => new
                {
                    AlbumsId = table.Column<Guid>(type: "uuid", nullable: false),
                    GenresTitle = table.Column<string>(type: "character varying(100)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlbumGenre", x => new { x.AlbumsId, x.GenresTitle });
                    table.ForeignKey(
                        name: "FK_AlbumGenre_Albums_AlbumsId",
                        column: x => x.AlbumsId,
                        principalTable: "Albums",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AlbumGenre_Genres_GenresTitle",
                        column: x => x.GenresTitle,
                        principalTable: "Genres",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GenreTrack",
                columns: table => new
                {
                    GenresTitle = table.Column<string>(type: "character varying(100)", nullable: false),
                    TracksId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GenreTrack", x => new { x.GenresTitle, x.TracksId });
                    table.ForeignKey(
                        name: "FK_GenreTrack_Genres_GenresTitle",
                        column: x => x.GenresTitle,
                        principalTable: "Genres",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GenreTrack_Tracks_TracksId",
                        column: x => x.TracksId,
                        principalTable: "Tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActorMovie_MoviesId",
                table: "ActorMovie",
                column: "MoviesId");

            migrationBuilder.CreateIndex(
                name: "IX_Actors_Name",
                table: "Actors",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ActorSeries_SeriesId",
                table: "ActorSeries",
                column: "SeriesId");

            migrationBuilder.CreateIndex(
                name: "IX_AlbumEpisodes_AlbumId",
                table: "AlbumEpisodes",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_AlbumGenre_GenresTitle",
                table: "AlbumGenre",
                column: "GenresTitle");

            migrationBuilder.CreateIndex(
                name: "IX_Albums_SingerId",
                table: "Albums",
                column: "SingerId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AudioStoryEpisodes_AudioStoryId",
                table: "AudioStoryEpisodes",
                column: "AudioStoryId");

            migrationBuilder.CreateIndex(
                name: "IX_AudioStoryGenre_GenresTitle",
                table: "AudioStoryGenre",
                column: "GenresTitle");

            migrationBuilder.CreateIndex(
                name: "IX_AudioStorySpeaker_SpeakersName",
                table: "AudioStorySpeaker",
                column: "SpeakersName");

            migrationBuilder.CreateIndex(
                name: "IX_BookGenre_GenresTitle",
                table: "BookGenre",
                column: "GenresTitle");

            migrationBuilder.CreateIndex(
                name: "IX_Books_Title_PublishedDate",
                table: "Books",
                columns: new[] { "Title", "PublishedDate" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BookWriter_WritersName",
                table: "BookWriter",
                column: "WritersName");

            migrationBuilder.CreateIndex(
                name: "IX_DirectorMovie_MoviesId",
                table: "DirectorMovie",
                column: "MoviesId");

            migrationBuilder.CreateIndex(
                name: "IX_Directors_Name",
                table: "Directors",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DirectorSeries_SeriesId",
                table: "DirectorSeries",
                column: "SeriesId");

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_SeasonId",
                table: "Episodes",
                column: "SeasonId");

            migrationBuilder.CreateIndex(
                name: "IX_GenreMagazine_MagazinesId",
                table: "GenreMagazine",
                column: "MagazinesId");

            migrationBuilder.CreateIndex(
                name: "IX_GenreMovie_MoviesId",
                table: "GenreMovie",
                column: "MoviesId");

            migrationBuilder.CreateIndex(
                name: "IX_GenreNewsPaper_NewsPapersId",
                table: "GenreNewsPaper",
                column: "NewsPapersId");

            migrationBuilder.CreateIndex(
                name: "IX_GenrePodCast_PodCastsId",
                table: "GenrePodCast",
                column: "PodCastsId");

            migrationBuilder.CreateIndex(
                name: "IX_Genres_Title",
                table: "Genres",
                column: "Title",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GenreSeries_SeriesId",
                table: "GenreSeries",
                column: "SeriesId");

            migrationBuilder.CreateIndex(
                name: "IX_GenreTrack_TracksId",
                table: "GenreTrack",
                column: "TracksId");

            migrationBuilder.CreateIndex(
                name: "IX_Magazines_PublisherId",
                table: "Magazines",
                column: "PublisherId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsPapers_PublisherId",
                table: "NewsPapers",
                column: "PublisherId");

            migrationBuilder.CreateIndex(
                name: "IX_PodCastEpisodes_PodCastId",
                table: "PodCastEpisodes",
                column: "PodCastId");

            migrationBuilder.CreateIndex(
                name: "IX_PodCastSpeaker_SpeakersName",
                table: "PodCastSpeaker",
                column: "SpeakersName");

            migrationBuilder.CreateIndex(
                name: "IX_Publishers_Name",
                table: "Publishers",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_SeriesId",
                table: "Seasons",
                column: "SeriesId");

            migrationBuilder.CreateIndex(
                name: "IX_Singers_Name",
                table: "Singers",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Speakers_Name",
                table: "Speakers",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_SingerId",
                table: "Tracks",
                column: "SingerId");

            migrationBuilder.CreateIndex(
                name: "IX_Writers_Name",
                table: "Writers",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActorMovie");

            migrationBuilder.DropTable(
                name: "ActorSeries");

            migrationBuilder.DropTable(
                name: "AlbumEpisodes");

            migrationBuilder.DropTable(
                name: "AlbumGenre");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "AudioStoryEpisodes");

            migrationBuilder.DropTable(
                name: "AudioStoryGenre");

            migrationBuilder.DropTable(
                name: "AudioStorySpeaker");

            migrationBuilder.DropTable(
                name: "BookGenre");

            migrationBuilder.DropTable(
                name: "BookWriter");

            migrationBuilder.DropTable(
                name: "Corus");

            migrationBuilder.DropTable(
                name: "DirectorMovie");

            migrationBuilder.DropTable(
                name: "DirectorSeries");

            migrationBuilder.DropTable(
                name: "Episodes");

            migrationBuilder.DropTable(
                name: "GenreMagazine");

            migrationBuilder.DropTable(
                name: "GenreMovie");

            migrationBuilder.DropTable(
                name: "GenreNewsPaper");

            migrationBuilder.DropTable(
                name: "GenrePodCast");

            migrationBuilder.DropTable(
                name: "GenreSeries");

            migrationBuilder.DropTable(
                name: "GenreTrack");

            migrationBuilder.DropTable(
                name: "PodCastEpisodes");

            migrationBuilder.DropTable(
                name: "PodCastSpeaker");

            migrationBuilder.DropTable(
                name: "UserLoginHistories");

            migrationBuilder.DropTable(
                name: "Actors");

            migrationBuilder.DropTable(
                name: "Albums");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "AudioStories");

            migrationBuilder.DropTable(
                name: "Books");

            migrationBuilder.DropTable(
                name: "Writers");

            migrationBuilder.DropTable(
                name: "Directors");

            migrationBuilder.DropTable(
                name: "Seasons");

            migrationBuilder.DropTable(
                name: "Magazines");

            migrationBuilder.DropTable(
                name: "Movies");

            migrationBuilder.DropTable(
                name: "NewsPapers");

            migrationBuilder.DropTable(
                name: "Genres");

            migrationBuilder.DropTable(
                name: "Tracks");

            migrationBuilder.DropTable(
                name: "PodCasts");

            migrationBuilder.DropTable(
                name: "Speakers");

            migrationBuilder.DropTable(
                name: "Series");

            migrationBuilder.DropTable(
                name: "Publishers");

            migrationBuilder.DropTable(
                name: "Singers");
        }
    }
}
