using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Models
{

public class ProtoKorisnik {

     [Key]
        public string  username  {get;set;}
         [Required]
         
        public string hashpass  {get;set;}

        [JsonIgnore]
        public int verifikovan {get;set;}

} 
   
    [Table("Korisnici")]
    public class Korisnik:ProtoKorisnik
    {
       
       public string? profilnaSlika {get;set;}
        [Required]
        public string ime {get;set;}

        [Required]
        public string prezime {get;set;}

        [Required]
        public string email  {get;set;}
        [Required]
        public DateTime datumRodjenja {get;set;}
        [Required]
        public char pol {get;set;}

        
       

    }
    [Table("Korisnici")]
    public class Glumac : Korisnik {
        
        [Required]
        public float visina {get;set;}
        [Required]
        public float tezina {get;set;}
        [Required]
        public string bojaKose {get;set;}
        [Required]
        public string bojaOciju {get;set;}

        [Required]
        public string nacionalnost {get;set;} 
        public List<PonudaUloga>? ponudjeneUloge {get;set;}
        public List<Poruka>? poruke {get;set;}
    }
    [Table("Korisnici")]
    public class Producent : Korisnik {
         [Required]
        public string adresaAudicije {get;set;}

        public Produkcija produkcija {get;set;}


        
    }
 public class KastingDirektor : Korisnik {
    [Required]
    public string prKod {get;set;}
 }
    


  
}
