using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Models {

[Table("Produkcije")]
 public class Produkcija {

        [Key]
    [StringLength(5,MinimumLength = 5)]
    public string kod {get;set;} 

    [Required]
    public string ime {get;set;}

    public List<Film>? filmovi {get;set;}
 }
}