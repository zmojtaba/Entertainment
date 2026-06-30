using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EntertainmentApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class noindexyetFro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Books_Title_PublishedDate",
                table: "Books");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Books_Title_PublishedDate",
                table: "Books",
                columns: new[] { "Title", "PublishedDate" },
                unique: true);
        }
    }
}
