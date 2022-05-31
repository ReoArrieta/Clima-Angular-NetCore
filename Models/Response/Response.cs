namespace ClimaApp.Models.Response
{
    public class Response
    {
        public object? Data { get; set; }
        public bool Exito { get; set; }
        public string Message { get; set; }
        public Response()
        {
            this.Exito = false;
            this.Message = string.Empty;
            this.Data = null;
        }
    }
}
