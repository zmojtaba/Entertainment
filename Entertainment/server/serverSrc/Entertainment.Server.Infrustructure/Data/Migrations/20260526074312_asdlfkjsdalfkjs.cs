using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Entertainment.Server.Infrustructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class asdlfkjsdalfkjs : Migration
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
