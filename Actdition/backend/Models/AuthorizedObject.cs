using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
[NotMapped]

public class AuthorizedObject<T> {
    [Required]
    public string Token {get;set;}
    public T Body {get;set;}
}