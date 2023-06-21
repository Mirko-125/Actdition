using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Models {

[Table("PonudeUloga")]
 public class PonudaUloga {
    [Key]
    public int id {get;set;}
    [Required]
    public string naslov {get;set;}
    [Required]
    public string pnguloge {get;set;}
    [Required]
    public string opisuloge {get;set;}
    public string? mp4 {get;set;}
    [Required]
     public string pdf {get;set;}
     
 }

 [Table("UlogeFilm")]
 public class UlogaFilm {
    [Key]
    public int id {get;set;}
    [Required]
   public string imelika {get;set;}

    [Required]
    public string opis {get;set;}
    [Required]
    public string pnglika {get;set;}

    [Required]
    public int godineMin {get;set;}
     [Required]
    public int godineMax {get;set;}
    [Required]
     public float visinaMin {get;set;}
     [Required]
    public float visinaMax {get;set;}
     [Required]
     public float tezinaMin {get;set;}
     [Required]
    public float tezinaMax {get;set;}

    [Required]
    public string bojaKose {get;set;}
    
    [Required]
    public string bojaOciju {get;set;}


    

 }
}