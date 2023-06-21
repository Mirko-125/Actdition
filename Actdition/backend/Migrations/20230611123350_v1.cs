using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class v1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Predlozi",
                columns: table => new
                {
                    idFilma = table.Column<int>(type: "int", nullable: false),
                    InternalData = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Predlozi", x => x.idFilma);
                });

            migrationBuilder.CreateTable(
                name: "Produkcije",
                columns: table => new
                {
                    kod = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    ime = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Produkcije", x => x.kod);
                });

            migrationBuilder.CreateTable(
                name: "Sesije",
                columns: table => new
                {
                    token = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    datumVazenja = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sesije", x => x.token);
                });

            migrationBuilder.CreateTable(
                name: "Verfikacije",
                columns: table => new
                {
                    token = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    username = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Verfikacije", x => x.token);
                });

            migrationBuilder.CreateTable(
                name: "Film",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    zanr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    trajanjeMinuta = table.Column<int>(type: "int", nullable: false),
                    uzrast = table.Column<int>(type: "int", nullable: false),
                    poster = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Produkcijakod = table.Column<string>(type: "nvarchar(5)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Film", x => x.id);
                    table.ForeignKey(
                        name: "FK_Film_Produkcije_Produkcijakod",
                        column: x => x.Produkcijakod,
                        principalTable: "Produkcije",
                        principalColumn: "kod");
                });

            migrationBuilder.CreateTable(
                name: "Korisnici",
                columns: table => new
                {
                    username = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    profilnaSlika = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    prezime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    datumRodjenja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    pol = table.Column<string>(type: "nvarchar(1)", nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    visina = table.Column<float>(type: "real", nullable: true),
                    tezina = table.Column<float>(type: "real", nullable: true),
                    bojaKose = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    bojaOciju = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    nacionalnost = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    prKod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    adresaAudicije = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    produkcijakod = table.Column<string>(type: "nvarchar(5)", nullable: true),
                    hashpass = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    verifikovan = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnici", x => x.username);
                    table.ForeignKey(
                        name: "FK_Korisnici_Produkcije_produkcijakod",
                        column: x => x.produkcijakod,
                        principalTable: "Produkcije",
                        principalColumn: "kod",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UlogeFilm",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    imelika = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    opis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    pnglika = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    godineMin = table.Column<int>(type: "int", nullable: false),
                    godineMax = table.Column<int>(type: "int", nullable: false),
                    visinaMin = table.Column<float>(type: "real", nullable: false),
                    visinaMax = table.Column<float>(type: "real", nullable: false),
                    tezinaMin = table.Column<float>(type: "real", nullable: false),
                    tezinaMax = table.Column<float>(type: "real", nullable: false),
                    bojaKose = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    bojaOciju = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Filmid = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UlogeFilm", x => x.id);
                    table.ForeignKey(
                        name: "FK_UlogeFilm_Film_Filmid",
                        column: x => x.Filmid,
                        principalTable: "Film",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "PonudeUloga",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    naslov = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    pnguloge = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    opisuloge = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    mp4 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    pdf = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Glumacusername = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PonudeUloga", x => x.id);
                    table.ForeignKey(
                        name: "FK_PonudeUloga_Korisnici_Glumacusername",
                        column: x => x.Glumacusername,
                        principalTable: "Korisnici",
                        principalColumn: "username");
                });

            migrationBuilder.CreateTable(
                name: "Poruke",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    adresa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    imeFilma = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    imeUloge = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Glumacusername = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Poruke", x => x.id);
                    table.ForeignKey(
                        name: "FK_Poruke_Korisnici_Glumacusername",
                        column: x => x.Glumacusername,
                        principalTable: "Korisnici",
                        principalColumn: "username");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Film_Produkcijakod",
                table: "Film",
                column: "Produkcijakod");

            migrationBuilder.CreateIndex(
                name: "IX_Korisnici_produkcijakod",
                table: "Korisnici",
                column: "produkcijakod");

            migrationBuilder.CreateIndex(
                name: "IX_PonudeUloga_Glumacusername",
                table: "PonudeUloga",
                column: "Glumacusername");

            migrationBuilder.CreateIndex(
                name: "IX_Poruke_Glumacusername",
                table: "Poruke",
                column: "Glumacusername");

            migrationBuilder.CreateIndex(
                name: "IX_UlogeFilm_Filmid",
                table: "UlogeFilm",
                column: "Filmid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PonudeUloga");

            migrationBuilder.DropTable(
                name: "Poruke");

            migrationBuilder.DropTable(
                name: "Predlozi");

            migrationBuilder.DropTable(
                name: "Sesije");

            migrationBuilder.DropTable(
                name: "UlogeFilm");

            migrationBuilder.DropTable(
                name: "Verfikacije");

            migrationBuilder.DropTable(
                name: "Korisnici");

            migrationBuilder.DropTable(
                name: "Film");

            migrationBuilder.DropTable(
                name: "Produkcije");
        }
    }
}
