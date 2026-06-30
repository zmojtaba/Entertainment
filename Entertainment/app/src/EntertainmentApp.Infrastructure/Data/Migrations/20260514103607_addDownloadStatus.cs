using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EntertainmentApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class addDownloadStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Writers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "UserLoginHistories",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Tracks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Speakers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Singers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Series",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Seasons",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Publishers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "PodCasts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "PodCastEpisodes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "NewsPapers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Movies",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Magazines",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Genres",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Episodes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Directors",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Corus",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Books",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "AudioStoryEpisodes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "AudioStories",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Albums",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "AlbumEpisodes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DownloadStatus",
                table: "Actors",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Writers");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "UserLoginHistories");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Speakers");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Singers");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Series");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Seasons");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Publishers");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "PodCasts");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "PodCastEpisodes");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "NewsPapers");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Magazines");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Genres");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Corus");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "AudioStoryEpisodes");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "AudioStories");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Albums");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "AlbumEpisodes");

            migrationBuilder.DropColumn(
                name: "DownloadStatus",
                table: "Actors");
        }
    }
}
