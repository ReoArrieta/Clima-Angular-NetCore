using ClimaApp.Models;
using ClimaApp.Models.Common;
using ClimaApp.Models.Request;
using ClimaApp.Models.Response;
using ClimaApp.Tools;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ClimaApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ClimaCTX _db = new();
        private readonly Response _res = new();
        private readonly AppSettings _appSettings;
        private readonly UserResponse _UserRes = new();
        public AuthController(IOptions<AppSettings> appSettings) => _appSettings = appSettings.Value;

        [HttpPost("signin")]
        public IActionResult Signin(AuthRequest model)
        {
            try
            {
                using (_db)
                {
                    string passwordEncrypt = Encrypt.GetSHA256(model.Contraseña);
                    var user = _db.Usuarios.Where(u => u.Correo == model.Correo && u.Contraseña == passwordEncrypt).FirstOrDefault();
                    if (user != null)
                    {
                        _UserRes.Correo = user.Correo;
                        _UserRes.Token = GetToken(user);
                        _res.Data = _UserRes;
                        _res.Exito = true;
                    }
                    else _res.Message = "Correo y/o contraseña incorrecto";
                }
            }
            catch (Exception e)
            {
                _res.Message = e.Message;
            }
            return Ok(_res);
        }

        [HttpPost("signup")]
        public IActionResult Signup(UserRequest model)
        {
            try
            {
                using (_db)
                {
                    string passwordEncrypt = Encrypt.GetSHA256(model.Contraseña.Trim());
                    Usuario user = new();
                    user.Nombre = model.Nombre.Trim();
                    user.Apellido = model.Apellido.Trim();
                    user.Correo = model.Correo.Trim();
                    user.Contraseña = passwordEncrypt;
                    user.FechaCreacion = DateTime.Now;
                    _db.Usuarios.Add(user);
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


        [HttpGet("email/{email}")]
        public IActionResult ReadEmail(string email)
        {
            try
            {
                using (_db)
                {
                    var data = _db.Usuarios.Where(p => p.Correo == email.Trim()).FirstOrDefault();
                    if (data != null) _res.Exito = true;
                }
            }
            catch (Exception e)
            {
                _res.Message = e.Message;
            }
            return Ok(_res);
        }


        #region Tools

        private string GetToken(Usuario user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var llave = Encoding.ASCII.GetBytes(_appSettings.Secreto);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.NameIdentifier, user.Correo)
                    }
                    ),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(llave), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        #endregion
    }
}
