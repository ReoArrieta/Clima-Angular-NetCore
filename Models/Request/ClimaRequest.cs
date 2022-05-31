namespace ClimaApp.Models.Request
{
    public class ClimaRequest
    {
        public int Id { get; set; }
        public string Descripcion { get; set; } = null!;
        public string Usuario { get; set; } = null!;
    }
}
