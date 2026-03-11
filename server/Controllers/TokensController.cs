using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TokensController : ControllerBase
    {
        // Get: api/tokens/all
        [HttpGet("all")]
        public async Task<IActionResult> FetchAllTokens()
        {
            Console.WriteLine("Reach API Endpoint : GET /api/tokens/all");
            return Ok(new { message = "API Endpoint fetching all tokens reached Successfully! " });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> FetchTokenById(string id)
        {
            return Ok(new { message = "API Endpoint for fetching single token by id reached Successfully! " });
        }
        
    }
}
