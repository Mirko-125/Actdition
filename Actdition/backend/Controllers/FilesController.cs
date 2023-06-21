using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Models;
using System.Web;

namespace Actdition.Controllers
{
    [ApiController]
    [Route("files")]
    public class FilesController : ControllerBase  {

      public static string getContentType(string FileName) {
        string contentType;
        new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider().TryGetContentType(FileName, out contentType);
        return contentType ?? "application/octet-stream";
      }
        string fileDir = "uploads/";

        public Context Context {get; set;}
        public FilesController(Context context){Context=context;}

        [Route("upload")]
        [HttpPost]
        public async Task<ActionResult> Upload( IFormFile file) {
          try
          {
     
            /*
              var token = Request.Cookies["token"];
            if( token == null) {
              return  Unauthorized("Nema sesije");
            }
           var s = Context.Sesije.Where(t => t.token == token).FirstOrDefault();
           if(token == null) {
            return Unauthorized("Sesija nije pronadjena");
           }
           */
           string ext = "";
           if(file.ContentType.StartsWith("image/") || file.ContentType.StartsWith("video/") || file.ContentType == "application/pdf" || file.ContentType == "image/gif") {
            ext ="." +file.ContentType.Split('/')[1];
           }
           if(ext == "") {
            return BadRequest("Dozvoljeni su samo snimci i slike i dokumenti");
           }
         string fname = Convert.ToHexString(RandomNumberGenerator.GetBytes(16)) + ext;  
        string fpath = Path.Combine(fileDir,fname );
       using (FileStream fs = System.IO.File.Create(fpath)) {
        file.CopyTo(fs);
       }
       return Ok(new {fname});
          }
          catch (System.Exception e)
          {
            return StatusCode(StatusCodes.Status500InternalServerError,e.Message);
          
          }

    }
     [Route("get/{fname}")]
        [HttpGet]
      //  [ResponseCache(Duration = 31536000, Location = ResponseCacheLocation.Client, NoStore = false)]
 public async Task<ActionResult> Get([FromRoute] string fname) {
  try
  {
     string fpath = Path.Combine(fileDir,fname);
     return new FileStreamResult(new FileStream(fpath, FileMode.Open),getContentType(fname));
  }
  catch (System.Exception e)
  {
    
    return NotFound(e.Message);
  }
 
  }


    }
}



 