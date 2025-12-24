using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EntertainmentApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addPodcast : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_UserName",
                table: "AspNetUsers");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e0b63ff8-9b31-43ef-8c66-af3dd024d012");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "2c67ab03-9ab2-4e6b-bdf2-7b29ac1beb3a", "e4875d49-50be-4c84-9cf4-8db440277cf8" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2c67ab03-9ab2-4e6b-bdf2-7b29ac1beb3a");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e4875d49-50be-4c84-9cf4-8db440277cf8");

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

            migrationBuilder.CreateIndex(
                name: "IX_GenrePodCast_PodCastsId",
                table: "GenrePodCast",
                column: "PodCastsId");

            migrationBuilder.CreateIndex(
                name: "IX_PodCastEpisodes_PodCastId_Title",
                table: "PodCastEpisodes",
                columns: new[] { "PodCastId", "Title" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PodCastSpeaker_SpeakersName",
                table: "PodCastSpeaker",
                column: "SpeakersName");

            migrationBuilder.CreateIndex(
                name: "IX_Speakers_Name",
                table: "Speakers",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GenrePodCast");

            migrationBuilder.DropTable(
                name: "PodCastEpisodes");

            migrationBuilder.DropTable(
                name: "PodCastSpeaker");

            migrationBuilder.DropTable(
                name: "PodCasts");

            migrationBuilder.DropTable(
                name: "Speakers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2c67ab03-9ab2-4e6b-bdf2-7b29ac1beb3a", null, "Admin", "ADMIN" },
                    { "e0b63ff8-9b31-43ef-8c66-af3dd024d012", null, "User", "USER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "RefreshToken", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "e4875d49-50be-4c84-9cf4-8db440277cf8", 0, "a9491c7c-c38c-4df6-aa82-2d521f0ab5ec", null, false, false, null, null, "ADMIN", "AQAAAAIAAYagAAAAEC+GKjpQN2J/PsAHT5V/47qcmlAj6bA/UM7+vjFC5AMt6n/FgS9CnTS0bnRB3f3M5g==", null, false, null, "cc765318-cf70-4cbc-a4c3-bdb62c47bef5", false, "admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "2c67ab03-9ab2-4e6b-bdf2-7b29ac1beb3a", "e4875d49-50be-4c84-9cf4-8db440277cf8" });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_UserName",
                table: "AspNetUsers",
                column: "UserName",
                unique: true);
        }
    }
}
