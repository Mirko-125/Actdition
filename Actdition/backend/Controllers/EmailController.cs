using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Models;


namespace Actdition.Controllers
{
[ApiController]
    [Route("verify")]
    
    public class EmailController : ControllerBase  {
         public Context Context {get; set;}
        public EmailController(Context context){Context=context;}
    
    
     [Route("{token}")]
        [HttpGet]
      
 public async Task<ActionResult> Verify([FromRoute] string token) {
  try
  {
    var v = await Context.Verfikacije.FindAsync(token);
    if(v == null) {
        return NotFound(new {res = "Los token"});
    }
    var k = Context.Korisnici.Find(v.username);
    if(k == null) {
         return NotFound(new {res = "Nema tog korisnika"});
    }
    k.verifikovan = 1;
    Context.RemoveRange(v);
    await Context.SaveChangesAsync();
    return Ok("Uspesna verifikacija, mozete da zatvorite ovaj prozor");
    

  }
  catch (System.Exception e)
  {
    
    return NotFound(e.Message);
  }
}
    }
}