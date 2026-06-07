using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class SeedStocks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Stocks",
                columns: new[] { "Id", "CompanyName", "Industry", "LastDiv", "MarketCap", "Purchase", "Symbol" },
                values: new object[,]
                {
                    { 1, "Apple Inc.", "Consumer Electronics", 0.96m, 2800000000000L, 178.50m, "AAPL" },
                    { 2, "NVIDIA Corporation", "Semiconductors", 0.16m, 2150000000000L, 875.40m, "NVDA" },
                    { 3, "Intel Corporation", "Semiconductors", 0.50m, 132000000000L, 31.20m, "INTC" },
                    { 4, "Fawry for Banking Technology and Electronic Payments", "Fintech", 0.00m, 28000000000L, 18.75m, "FWRY" },
                    { 5, "Breadfast", "E-commerce & Delivery", 0.00m, 500000000L, 5.20m, "BRDF" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Stocks",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Stocks",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Stocks",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Stocks",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Stocks",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
