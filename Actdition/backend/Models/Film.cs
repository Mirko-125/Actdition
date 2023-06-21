using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Models {

[Table("Film")]
 public class Film {
    [Key]
    public int id {get;set;}
    [Required]
    public string ime {get;set;}
    [Required]
    public string zanr {get;set;}
    [Required]
    public int trajanjeMinuta {get;set;}
    [Required]
     public int uzrast {get;set;}
    [Required]
    public string poster {get;set;}
     [Required]
     public virtual List<UlogaFilm> listaUloga {get;set;}
 }

}