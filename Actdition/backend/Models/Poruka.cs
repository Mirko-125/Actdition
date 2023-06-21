using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Models
{
[Table("Poruke")]
public class Poruka {
        public Poruka(int id, string adresa, string imeFilma, string imeUloge)
        {
            this.adresa = adresa;
            this.imeFilma = imeFilma;
            this.imeUloge = imeUloge;
        }

        [Key]
    public  int id {get;set;}
    [Required]
    public string adresa {get;set;}
    public string imeFilma {get;set;}

    public string imeUloge {get;set;}
}
}