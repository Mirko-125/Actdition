using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class Context:DbContext
    {
        public Context(DbContextOptions options):base(options){}

            public DbSet<Korisnik> Korisnici {get; set;}
            public DbSet<Glumac> Glumci {get; set;}
             public DbSet<Producent> Producenti {get; set;}

             public DbSet<KastingDirektor> KastingDirektori {get; set;}
            public DbSet<Produkcija> Produkcije {get;set;}
             public DbSet<PonudaUloga> PonudeUloga {get;set;}
              public DbSet<UlogaFilm> UlogeFilm {get;set;}
              public DbSet<Film> Filmovi {get;set;}

              public DbSet<Sesija> Sesije {get;set;}
              public DbSet<Verfikacija> Verfikacije {get;set;}

              public DbSet<Predlog> Predlozi {get;set;}
                public DbSet<Poruka> Poruke {get;set;}

        }
    }
