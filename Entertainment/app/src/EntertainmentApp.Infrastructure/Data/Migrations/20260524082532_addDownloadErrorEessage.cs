using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EntertainmentApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class addDownloadErrorEessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Writers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "UserLoginHistories",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Tracks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Speakers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Singers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Series",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Seasons",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Publishers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "PodCasts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "PodCastEpisodes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "NewsPapers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Movies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Magazines",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Genres",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Episodes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Directors",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Corus",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Books",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "AudioStoryEpisodes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "AudioStories",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Albums",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "AlbumEpisodes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "Actors",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Writers");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "UserLoginHistories");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Speakers");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Singers");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Series");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Seasons");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Publishers");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "PodCasts");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "PodCastEpisodes");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "NewsPapers");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Magazines");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Genres");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Corus");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "AudioStoryEpisodes");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "AudioStories");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Albums");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "AlbumEpisodes");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "Actors");
        }
    }
}
