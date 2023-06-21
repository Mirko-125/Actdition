using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Models {

[Table("Predlozi")]
 public class Predlog {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int idFilma {get;set;}
   

  [JsonIgnore]
  
     public string InternalData { get; set; }
[NotMapped]
 public int[] listaIdUloga
 {
    get
    {
        return Array.ConvertAll(InternalData.Split(';'), Int32.Parse);                
    }
    set
    {
        var _data = value;
        InternalData = String.Join(";", _data.Select(p => p.ToString()).ToArray());
    }
 }
 }
}