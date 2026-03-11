using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TokensController : ControllerBase
    {
        // Get: api/tokens/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTokens()
        {
            Console.WriteLine("Reach API Endpoint : GET /api/tokens/all");
            return Ok(new { message = "API Endpoint reached Successfully! " });
        }
        
    }
}
