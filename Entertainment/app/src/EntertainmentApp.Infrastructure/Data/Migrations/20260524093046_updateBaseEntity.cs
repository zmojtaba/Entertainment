using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EntertainmentApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateBaseEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Writers",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Writers",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "UserLoginHistories",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "UserLoginHistories",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Tracks",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Tracks",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Speakers",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Speakers",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Singers",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Singers",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Series",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Series",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Seasons",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Seasons",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Publishers",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Publishers",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "PodCasts",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "PodCasts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "PodCastEpisodes",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "PodCastEpisodes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "NewsPapers",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "NewsPapers",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Movies",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Movies",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Magazines",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Magazines",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Genres",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Genres",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Episodes",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Episodes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Directors",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Directors",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Corus",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Corus",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Books",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Books",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "AudioStoryEpisodes",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "AudioStoryEpisodes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "AudioStories",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "AudioStories",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Albums",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Albums",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "AlbumEpisodes",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "AlbumEpisodes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyDownload",
                table: "Actors",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadRetryCount",
                table: "Actors",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Writers");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Writers");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "UserLoginHistories");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "UserLoginHistories");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Speakers");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Speakers");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Singers");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Singers");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Series");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Series");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Seasons");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Seasons");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Publishers");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Publishers");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "PodCasts");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "PodCasts");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "PodCastEpisodes");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "PodCastEpisodes");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "NewsPapers");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "NewsPapers");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Magazines");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Magazines");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Genres");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Genres");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Corus");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Corus");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "AudioStoryEpisodes");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "AudioStoryEpisodes");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "AudioStories");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "AudioStories");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Albums");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Albums");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "AlbumEpisodes");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "AlbumEpisodes");

            migrationBuilder.DropColumn(
                name: "CurrentlyDownload",
                table: "Actors");

            migrationBuilder.DropColumn(
                name: "DownloadRetryCount",
                table: "Actors");
        }
    }
}
