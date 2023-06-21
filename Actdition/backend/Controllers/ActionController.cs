using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;


namespace Actdition.Controllers
{

    
internal class PredlogUlogeVeza {
        public PredlogUlogeVeza(Film film, List<PonudaUloga> ponude)
        {
            this.film = film;
            this.ponude = ponude;
        }

        public Film film {get;set;}

    public List<PonudaUloga> ponude{get;set;}
    
}
[ApiController]
    [Route("movies")]
    public class ActionController : ControllerBase  {
         public Context Context {get; set;}
        public ActionController(Context context){Context=context;}
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
        public async Task<ActionResult> CreateMovie([FromBody]  AuthorizedObject<Film> movie) {
            try
            {
      
                  var k = checkAuthorization(movie);
                 
           if(k is not Producent) {
            return Unauthorized(new {res = "Nisi producent"});
           }
           
           Producent p = (Producent)k;
            
           Film f = movie.Body;
           p.produkcija = Context.Producenti.Where(pr => pr.username == p.username).Select(pro => pro.produkcija).FirstOrDefault();
           if(p.produkcija == null) {
             return NotFound(new {res = "Nema produkciju!?!?!?"});
           }
           if(p.produkcija.filmovi == null) {
            p.produkcija.filmovi = new List<Film>();
           }
        
           p.produkcija.filmovi.Add(f);
           Context.SaveChanges();
           return Ok(new {res = "OK"});
           
            

            }
            catch (System.Exception e)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.ToString()});
            }
         

 
  }
         [Route("edit")]
        [HttpPost]
        public async Task<ActionResult> EditMovie([FromBody]  AuthorizedObject<Film> movie) {
            try
            {
                  var k = checkAuthorization(movie);
           if(k is not Producent) {
            return Unauthorized(new {res = "Nisi producent"});
           }
           Film rf = movie.Body;
           var dbfilm = Context.Filmovi.Where(fi => fi.ime == rf.ime).FirstOrDefault();
           if(dbfilm == null ) {
            return NotFound(new {res = "Nema takvog filma"});
           }
           Context.Filmovi.RemoveRange(dbfilm);
           Context.Filmovi.Add(rf);
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
        public async Task<ActionResult> DeleteMovie([FromBody]  AuthorizedObject<int> movie) {
            try
            {
                  var k = checkAuthorization(movie);
           if(k is not Producent) {
            return Unauthorized(new {res = "Nisi producent"});
           }
           int id = movie.Body;
             var res = Context.Producenti.Include(u => u.produkcija.filmovi).ThenInclude(f => f.listaUloga).Where(u => u.username == k.username).Select(p => p.produkcija.filmovi).FirstOrDefault().Where(f => f.id == movie.Body).FirstOrDefault();

            Context.UlogeFilm.RemoveRange(res.listaUloga);
            
            Context.Filmovi.RemoveRange(res);
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
        public async Task<ActionResult> listMovies([FromBody]  string token) {
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
              if(k is not Producent && k is not KastingDirektor) {
                return Unauthorized(new {res = "Nisi producent ni kastingDirektor"});
              }
              if(k is Producent) {
                     var res = Context.Producenti.Include(u => u.produkcija.filmovi).ThenInclude(f => f.listaUloga).Where(u => u.username == k.username).Select(p => p.produkcija.filmovi).FirstOrDefault();
                 return Ok(res);
              }
              if(k is KastingDirektor) {
                KastingDirektor kd = (KastingDirektor)k;
                var filmovi = Context.Produkcije.Where(p => p.kod == kd.prKod).Include(p => p.filmovi).ThenInclude(f => f.listaUloga).Select(p => p.filmovi).FirstOrDefault();
                var predlozi = filmovi.Where(f => Context.Predlozi.Any(p => p.idFilma == f.id));
                return Ok(filmovi.Except(predlozi));
              }
                return BadRequest("Ovde ne bi trebalo da dodjemo");
             
            

            }
            catch (System.Exception e)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.Message});
            }
         
        }
  
  
  

       [Route("predlozi")]
        [HttpPost]
        public async Task<ActionResult> Predlozi([FromBody]  AuthorizedObject<Predlog> predlog) {
              try
            {  
                var k = checkAuthorization(predlog);
                if(k is not KastingDirektor) {
                    return Unauthorized(new {res = "Nisi kasting direktor"});
                }
                var kast = (KastingDirektor)k;
                if(Context.Produkcije.Where(pr => pr.kod == kast.prKod).Select(p => p.filmovi).FirstOrDefault().Where(f => f.id == predlog.Body.idFilma).FirstOrDefault() == null) {
                    return NotFound(new {res = "Nema takvog filma, ili nije iz tvoje produkcije"});
                }
                Context.Predlozi.Add(predlog.Body);
                await Context.SaveChangesAsync();
                return Ok(new {res = "OK"});



                

            }   catch (System.Exception e)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.Message});
            }
        }
        [Route("odbi")]
        [HttpPost]
        public async Task<ActionResult> OdbiPredlog([FromBody]  AuthorizedObject<int> predlog) {
              try
            {  
                var k = checkAuthorization(predlog);
                if(k is not Producent && k is not KastingDirektor) {
                    return Unauthorized(new {res = "Nisi ni producent ni kasting direktor"});
                }
                
                Context.Predlozi.RemoveRange(Context.Predlozi.Find(predlog.Body));
                await Context.SaveChangesAsync();
                return Ok(new {res = "OK"});



                

            }   catch (System.Exception e)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.Message});
            }
        }
        [Route("odobri")]
        [HttpPost]
        public async Task<ActionResult> OdobriPredlog([FromBody]  AuthorizedObject<int> predlog) {
              try
            {  
                var k = checkAuthorization(predlog);
                if(k is not Producent) {
                    return Unauthorized(new {res = "Nisi producent"});
                }
               
                Producent p = (Producent)k;
                 var mojaProdukcija = Context.Producenti.Where(pr => pr.username == p.username).Select(pr => pr.produkcija).FirstOrDefault();
                var mojiFilmovi = Context.Produkcije.Where(pr => pr.kod == mojaProdukcija.kod).Include(pr => pr.filmovi).Select(pr => pr.filmovi).FirstOrDefault();
                var predlz = Context.Predlozi.ToList();
                var predlozi =predlz.Where(pr => mojiFilmovi.Any(f => pr.idFilma == f.id));

                var iduloge = predlozi.Select(pr => pr.listaIdUloga).Where(lu => lu.Contains(predlog.Body)).FirstOrDefault().Where(id => id == predlog.Body).FirstOrDefault();
                var uloga = Context.PonudeUloga.Find(iduloge);
               var glumac = Context.Glumci.Include(g => g.ponudjeneUloge).Where(g => g.ponudjeneUloge.Any(ul => ul.id == iduloge)).FirstOrDefault();
                var idFilma = predlozi.Where(pr => pr.listaIdUloga.Contains(iduloge)).FirstOrDefault().idFilma;
                var imeFilma = Context.Filmovi.Find(idFilma).ime;
                if(glumac.poruke == null) {
                    glumac.poruke = new List<Poruka>();
                }
                glumac.poruke.Add(new Poruka(idFilma,p.adresaAudicije,imeFilma,uloga.naslov));
                glumac.ponudjeneUloge.Remove(uloga);
                Context.PonudeUloga.RemoveRange(uloga);
                Context.SaveChanges();
            return Ok(new {res = "OK"});
  

                

            }   catch (System.Exception e)
            {
                if(e is System.ArgumentNullException) {
                          return NotFound(new {res = "Nema te uloge, ili ne pripada tvojoj produkciji"});
                }
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.Message, type = e.GetType().ToString()});
            }
        }
        [Route("listPredlog")]
        [HttpPost]
        public async Task<ActionResult> ListPredlog([FromBody]  string token) {
              try
            {  
 
             if( token == null) {
              return BadRequest(new {res = "Token nije postavljen"});
            }
           var s = Context.Sesije.Where(t => t.token == token).FirstOrDefault();
           if(s == null) {
            return Unauthorized(new {res = "Sesija nije pronadjena"});
           }
                            
           var p = Context.Producenti.Find(s.username);
     
           if(p == null) {
             return NotFound(new {res = "Nepostojeci producent "});
           }
               
                var mojaProdukcija = Context.Producenti.Where(pr => pr.username == p.username).Select(pr => pr.produkcija).FirstOrDefault();
                   
                var mojiFilmovi = Context.Produkcije.Where(pr => pr.kod == mojaProdukcija.kod).Include(pr => pr.filmovi).ThenInclude(f => f.listaUloga).Select(f => f.filmovi).FirstOrDefault();
                                  
                var predlozeniFilmovi = mojiFilmovi.Where(f => Context.Predlozi.Any(pr => pr.idFilma == f.id));

                var resFilmovi = mojiFilmovi.Intersect(predlozeniFilmovi);
         
                var filmoviUloge = new List<PredlogUlogeVeza>();
                var svePonude = Context.PonudeUloga.ToList();
                foreach(Film f in resFilmovi) {
                    var idu = Context.Predlozi.Find(f.id)?.listaIdUloga;
                    var listaUloga = svePonude.Where(pon => idu.Any(pr => pr == pon.id)).ToList();
                    if(!listaUloga.Any()) {
                        continue;
                    }
                    filmoviUloge.Add(new PredlogUlogeVeza(f,listaUloga));

                }
                return Ok(filmoviUloge);
                

                

            }   catch (System.Exception e)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError, new {error = e.StackTrace});
            }
        }
}

          
}