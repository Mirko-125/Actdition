using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;


namespace Actdition.Controllers
{
[ApiController]
    [Route("roles")]
    
    public class UlogeController : ControllerBase  {
         public Context Context {get; set;}
        public UlogeController(Context context){Context=context;}
        [NonAction]
        public  Korisnik checkAuthorization<T>(AuthorizedObject<T> ao) {
            var s = Context.Sesije.Find(ao.Token);
            if(s == null) {
                return null;
            }
            return Context.Korisnici.Find(s.username);
        }

        [Route("create")]
        [HttpPost]
        public async Task<ActionResult> CreateRole([FromBody]  AuthorizedObject<PonudaUloga> ul) {
            try
            {
                  var k = checkAuthorization(ul);
           if(k is not Glumac || k == null)  {
            return Unauthorized(new {res = "Nisi glumac"});
           }
           PonudaUloga f = ul.Body;
            Glumac g = (Glumac)k;
            if(g == null) {
                return NotFound(new {res = "Nema glumca!"});
            }
           if(g.ponudjeneUloge == null) {
            g.ponudjeneUloge = new List<PonudaUloga>();
           }
             g.ponudjeneUloge.Add(ul.Body);
           await Context.SaveChangesAsync();
           return Ok(new {res = "OK"});
           
            

            }
            catch (System.Exception e)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.InnerException.Message});
            }
         

 
  }
         [Route("edit")]
        [HttpPost]
        public async Task<ActionResult> EditRole([FromBody]  AuthorizedObject<PonudaUloga> ul) {
            try
            {
                  var k = checkAuthorization(ul);
           if(k is not Glumac) {
            return Unauthorized(new {res = "Nisi glumac"});
           }
           PonudaUloga rf = ul.Body;
           /*
           var dbul = Context.PonudeUloga.Where(fi => fi.id == rf.id).FirstOrDefault();
           if(dbul == null ) {
            return NotFound(new {res = "Nema takve uloge"});
           }
           */
            Glumac g = (Glumac)k;
            g.ponudjeneUloge.Add(ul.Body);
           Context.SaveChanges();
           return Ok(new {res = "OK"});
           
            

            }
            catch (System.Exception e)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.InnerException.Message});
            }
         
        }
        [Route("delete")]
        [HttpDelete]
        public async Task<ActionResult> DeleteRole([FromBody]  AuthorizedObject<int> role) {
            try
            {
                  var k = checkAuthorization(role);
           if(k is not Glumac) {
            return Unauthorized(new {res = "Nisi glumac"});
           }
           var id = role.Body ;
           /*
           var dbul = Context.PonudeUloga.Where(fi => fi.id == id).FirstOrDefault();
           if(dbul == null ) {
            return NotFound(new {res = "Nema takve uloge"});
           }
           */
           Glumac g = (Glumac)k;
         
            var query = Context.Glumci.Where(gl => gl.username == g.username).Select(gl => gl.ponudjeneUloge).FirstOrDefault();
            
            if(query == null) {
                throw new Exception("Ovo nece nesto");
            }
            
            Context.PonudeUloga.RemoveRange(query.Where(ul => role.Body == ul.id));
         Context.SaveChanges();
           return Ok(new {res = "OK"});
           
            

            }
            catch (System.Exception e)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.Message});
            }
         
        }
        [Route("list")]
        [HttpPost]
        public async Task<ActionResult> ListRoles([FromBody]  string token) {
            try
            {
            if( token == null) {
              return BadRequest(new {res = "Token nije postavljen"});
            }
           var s = Context.Sesije.Find(token);
           if(s == null) {
            return Unauthorized(new {res = "Sesija nije pronadjena"});
           }
           var k =Context.Korisnici.Find(s.username);
           if(k == null) {
             return NotFound(new {res = "Nepostojeci korisnik"});
           }

           if(k is not Glumac && k is not KastingDirektor) {
            return Unauthorized(new {res = "Nisi ni glumac ni KastingDirektor"});
           }
           if(k is Glumac) {
            var g = (Glumac)k;
            return Ok(Context.Glumci.Where(u => u.username == g.username).Select(s => s.ponudjeneUloge).FirstOrDefault());
           }
           if(k is KastingDirektor) {
            var gl = Context.Glumci.Include(g => g.ponudjeneUloge).ToList();
            gl.ForEach(g => {
                g.hashpass = "<REDACTED>";
                g.email = "<REDACTED>";
            });
            return Ok(gl);
           }
           return BadRequest();
           
    
          
      
            

            }
            catch (System.Exception e)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.InnerException.Message});
            }
         
        }
  
  
  

      
}
}