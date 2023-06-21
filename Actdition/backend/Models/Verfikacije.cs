using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models {

[Table("Verfikacije")]
public class Verfikacija {
[Key]
public string token {get;set;}
[Required]
public string username {get;set;}
}
}