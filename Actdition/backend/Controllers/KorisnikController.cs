using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using  Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using System.Net.Mail;
using System.Net;

namespace Actdition.Controllers

{
    [ApiController]
    [Route("users")]
    public class KorisnikController:ControllerBase
    {
                [NonAction]
                public  Korisnik checkAuthorization<T>(AuthorizedObject<T> ao) {
            var s = Context.Sesije.Find(ao.Token);
            if(s == null) {
                return null;
            }
            return Context.Korisnici.Find(s.username);
        }
        const bool requireVerification = true;
        public Context Context {get; set;}
        public KorisnikController(Context context){Context=context;}
        
        [Route("changepfp")]
        [HttpPost]
          public async Task<ActionResult> ChangePFP([FromBody] AuthorizedObject<string> pfp) {
            try
            {
               var k = checkAuthorization(pfp);
               if(k == null) {
                return Unauthorized(new {res = "Nema sesije"});
               } 
               k.profilnaSlika = pfp.Body;
               await Context.SaveChangesAsync();
               return Ok(new {res = "OK"});

            }    catch(Exception e) {
                return StatusCode(StatusCodes.Status500InternalServerError,e);
            }
          }

        [Route("login")]
        [HttpPost]
        
        public async Task<ActionResult> Login([FromBody] ProtoKorisnik ko) {
            try
            {
            
                Korisnik kor =  Context.Korisnici.Where(p => p.username == ko.username).SingleOrDefault();
                if(!BCrypt.Net.BCrypt.Verify(ko.hashpass,kor.hashpass)) {
                    return Unauthorized(new { status = "Losa lozinka"});
                }
                if(kor.verifikovan == 0 && requireVerification)  {
                    return Unauthorized(new { status = "Niste verifikovani"});
                }
                string token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
                var datum = DateTime.UtcNow;
                datum =  datum.AddHours(24);
                var s = Context.Sesije.Where(p => p.username == ko.username).SingleOrDefault();
                if(s != null) {
                    Context.Sesije.RemoveRange(s);
                    await Context.SaveChangesAsync();
                }
            
                foreach(Sesija se in Context.Sesije) {
                    if(DateTime.Now > se.datumVazenja) {
                        Context.Sesije.RemoveRange(se);
                    }
                }
    
                s = new Sesija();
                s.token = token;
                s.datumVazenja = datum;
                s.username = ko.username;
                Context.Sesije.Add(s);
                await Context.SaveChangesAsync();
                return Ok(new {token, tip = Context.Korisnici.Find(ko.username)!.GetType().Name });            

            }
            catch (NullReferenceException)
            {
                return NotFound(new {status = "Nema takvog korsnika"});
                
            }
            catch(Exception e) {
                return StatusCode(StatusCodes.Status500InternalServerError,e);
            }
                
                    
                
        }

        [Route("registerActor")]
        [HttpPost]
        
        public async Task<ActionResult> registerActor([FromBody] Glumac gl) {
          
            try {
                 gl.hashpass = BCrypt.Net.BCrypt.HashPassword(gl.hashpass,14);  
                Context.Glumci.Add(gl);
                gl.verifikovan = 0;
                await Context.SaveChangesAsync();
                SendVerificationEmail(gl);
               return Ok(new {res = "OK"});
                /*
                switch(re.tip) {
                    case Tip.Sysadmin:
                    re.ko.RootElement.GetProperty().Des
                       
                Context.Korisnici.Add(ko);
                await await Context.SaveChanges();Async();
                return Ok("Sysadmin je dodat");

                case Tip.Glumac:
                
                case Tip.Producent:
                
                 case Tip.KastingDirektor:
                 KastingDirektor kd = (KastingDirektor)re.ko;       
                Context.KastingDirektori.Add(kd);
                await await Context.SaveChanges();Async();
                return Ok("Kasting direktor je dodat");*/
   

            
                
           
            } catch(Exception e) {
                return BadRequest(e.Message);
            }
        }
         [Route("registerProducer")]
        [HttpPost]
            public async Task<ActionResult> registerProducer([FromBody] Producent pr) {
                 try {
                pr.hashpass = BCrypt.Net.BCrypt.HashPassword(pr.hashpass,14);  
                Context.Producenti.Add(pr);
                if(pr.produkcija != null) {
                    Context.Produkcije.Add(pr.produkcija);
                }
                pr.verifikovan = 0;
                await Context.SaveChangesAsync();
                return Ok(new {res = "OK"});
                } catch(Exception e) {
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.InnerException.Message});
            }
                    
                
        }

     [Route("registerCastingDirektor")]
        [HttpPost]
                    public async Task<ActionResult> registerCD([FromBody] KastingDirektor kd) {
                 try {
                    if(Context.Produkcije.Find(kd.prKod) == null) {
                        return NotFound(new {res = "Nema takve produkcije"});
                    }
                    kd.hashpass = BCrypt.Net.BCrypt.HashPassword(kd.hashpass,14);  
                Context.KastingDirektori.Add(kd);
                kd.verifikovan = 0;
                SendVerificationEmail(kd);
                 await Context.SaveChangesAsync();
                return Ok(new {res = " OK"});
                } catch(Exception e) {
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.InnerException.Message});
            }
                    
                
        }

        [Route("listActor")]
        [HttpGet]
        public async Task<ActionResult> ListGlumci() {
          return Ok(Context.Glumci.ToList());
        }
        [Route("listProductions")]
        [HttpGet]
        public async Task<ActionResult> ListProdukcije() {
            List<string> arr = new List<string>();
          var prod = Context.Produkcije.ToList();
          foreach(var  p in prod) {
            arr.Add( p.ime);
          }
          return Ok(arr);
        }
/*
        [Route("checkProductionCode")]
        [HttpPost]
        public async Task<ActionResult> ProveriKod([FromBody] string kod) {
            bool found = Context.Produkcije.Where(pr => pr.kod == kod).FirstOrDefault() != null;
            return Ok(found);
           
        }
        */
        [Route ("getUserData")]
        [HttpPost]
        public async Task<ActionResult> getUserData([FromBody]string token) {
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
           return  Ok(k);
           
           }
           catch (System.Exception e)
           {
            
            throw;
           }
           
        }
        
       [Route ("logout")]
        [HttpPost]
        public async Task<ActionResult> Logout([FromBody]string token) {
          try
           {

            if( token == null) {
              return BadRequest(new {res = "Token nije postavljen"});
            }
           var s = Context.Sesije.Where(t => t.token == token).FirstOrDefault();
           if(s == null) {
            return Unauthorized(new {res = "Sesija nije pronadjena"});
           }
         
           Context.Sesije.RemoveRange(s);
           await Context.SaveChangesAsync();
           return Ok(new {res = "OK"});
           
           }
           catch (System.Exception e)
           {
            
            return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.Message});
           }
        }

        [Route ("getInbox")]
        [HttpPost]
        public async Task<ActionResult> getInbox([FromBody]string token) {
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
           return  Ok(Context.Glumci.Where(g => g.username == k.username).Select(g => g.poruke).FirstOrDefault());
           
           
           }
           catch (System.Exception e)
           {
            
            return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.Message});
           }
        }
         [Route ("delete")]
        [HttpDelete]
        public async Task<ActionResult> DeleteUser([FromBody] AuthorizedObject<string> ao) {
           try
           {
            var token = ao.Token;
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
           if(!BCrypt.Net.BCrypt.Verify(ao.Body,k.hashpass)) {
            return Unauthorized(new {res = "Losa lozinka"});
           }
           Context.Sesije.RemoveRange(s!);
           Context.Korisnici.RemoveRange(k);
           await Context.SaveChangesAsync();
            return Ok(new {res = "OK"});
           } catch (Exception e) {
                 return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.InnerException.Message});
           }
        }
        [NonAction]
 public  void SendVerificationEmail(Korisnik k) {
    if(!requireVerification) {
        return;
    }
    const string url = "http://127.0.0.1:5000";
    try
    {
        Verfikacija v = new Verfikacija();
        v.token =  Convert.ToHexString(RandomNumberGenerator.GetBytes(16)).ToLower();
        v.username = k.username;
        Context.Verfikacije.Add(v);
         Context.SaveChanges();
        var fromAddress = new MailAddress("keanureevesspeed94@gmail.com");
        var toAddress = new MailAddress(k.email);
        const string fromPassword = "xnabpojnlbageboe";
       
const string subject = "Actdition";
string body = $"Link za verifikaciju vaseg naloga je {url}/verify/{v.token}";

var smtp = new SmtpClient
{
    Host = "smtp.gmail.com",
    Port = 587,
    EnableSsl = true,
    DeliveryMethod = SmtpDeliveryMethod.Network,
    UseDefaultCredentials = false,
    Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
};
using (var message = new MailMessage(fromAddress, toAddress)
{
    Subject = subject,
    Body = body
})
{
    smtp.Send(message);
}

    }
    catch (System.Exception e)
    {
        
        Console.WriteLine( e.InnerException.Message);
    }
 }
 
    }
    
    }
        


