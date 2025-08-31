using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DiyarbakırApi.Migrations
{
    /// <inheritdoc />
    public partial class AddModerationFields_Fix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Places",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Published");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Places",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.CreateIndex(
                name: "IX_Places_Status",
                table: "Places",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Places_Status",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Places");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Places");
        }
    }
}
