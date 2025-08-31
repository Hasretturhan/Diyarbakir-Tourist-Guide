using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DiyarbakırApi.Migrations
{
    /// <inheritdoc />
    public partial class AddEnFieldsToPlace_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Places",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TagsEn",
                table: "Places",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "TagsEn",
                table: "Places");
        }
    }
}
