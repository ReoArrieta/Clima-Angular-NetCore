using System;
using System.Collections.Generic;

namespace ClimaApp.Models
{
    public partial class DatosClima
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = null!;
        public string UsuarioCreador { get; set; } = null!;
        public DateTime FechaCreacion { get; set; }
        public string? UsuarioModicador { get; set; }
        public DateTime? FechaModicador { get; set; }
    }
}
