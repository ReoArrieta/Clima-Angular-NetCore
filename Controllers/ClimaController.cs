using ClimaApp.Models;
using ClimaApp.Models.Request;
using ClimaApp.Models.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClimaApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClimaController : ControllerBase
    {
        private readonly ClimaCTX _db = new();
        private readonly Response _res = new();

        [HttpPost]
        public IActionResult Create(ClimaRequest model)
        {
            try
            {
                using (_db)
                {
                    DatosClima clima = new();
                    clima.Descripcion = model.Descripcion;
                    clima.UsuarioCreador = model.Usuario;
                    clima.FechaCreacion = DateTime.Now;
                    clima.FechaModicador = DateTime.Now;
                    clima.UsuarioModicador = model.Usuario;
                    _db.DatosClimas.Add(clima);
                    _db.SaveChanges();

                    _res.Exito = true;
                }
            }
            catch (Exception e)
            {
                _res.Message = e.Message;
            }
            return Ok(_res);
        }

        [HttpGet]
        public IActionResult Read()
        {
            try
            {
                using (_db)
                {
                    var data = _db.DatosClimas.OrderByDescending(c => c.Id).ToList();
                    _res.Data = data;
                    _res.Exito = true;
                }
            }
            catch (Exception e)
            {
                _res.Message = e.Message;
            }
            return Ok(_res);
        }

        [HttpPut]
        public IActionResult Update(ClimaRequest model)
        {
            try
            {
                using (_db)
                { 
                    DatosClima clima = _db.DatosClimas.Find(model.Id) ?? new();
                    clima.Descripcion = model.Descripcion;
                    clima.FechaModicador = DateTime.Now;
                    clima.UsuarioModicador = model.Usuario;
                    _db.Entry(clima).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    _db.SaveChanges();

                    _res.Exito = true;
                }
            }
            catch (Exception e)
            {
                _res.Message = e.Message;
            }
            return Ok(_res);
        }

        [HttpDelete("{Id}")]
        public IActionResult Delete(int Id)
        {
            try
            {
                using (_db)
                {
                    var clima = _db.DatosClimas.Find(Id) ?? new();
                    _db.DatosClimas.Remove(clima);
                    _db.SaveChanges();

                    _res.Exito = true;
                }
            }
            catch (Exception e)
            {
                _res.Message = e.Message;
            }
            return Ok(_res);
        }
    }
}
