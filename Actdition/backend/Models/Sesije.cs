using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models {

[Table("Sesije")]
public class Sesija {
[Key]
public string token {get;set;}
[Required]
public string username {get;set;}

public  DateTime datumVazenja {get;set;}
 
}
}