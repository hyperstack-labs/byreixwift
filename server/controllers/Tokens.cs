using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Tokens : ControllerBase
    {
        // Get: api/tokens/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTokens()
        {
            return Ok(new { message = "API Endpoint reached Successfully! ");
        }
        
    }
}
