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

        // Get: api/tokens/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> FetchTokenById(string id)
        {
            Console.WriteLine($"Reach API Endpoint : GET /api/tokens/{id}");
            return Ok(new { message = "API Endpoint for fetching single token by id reached Successfully! " });
        }

        // Get: api/tokens/prices
        [HttpGet("prices")]
        public async Task<IActionResult> FetchTokenPrices()
        {
            Console.WriteLine("Reach API Endpoint : GET /api/tokens/prices");
            return Ok(new { message = "API Endpoint for fetching token prices reached Successfully! " });
        }
        // Get: api/tokens/{id}/price
        [HttpGet("{id}/price")]
        public async Task<IActionResult> FetchTokenPriceById(string id)
        {
            Console.WriteLine($"Reached API Endpoint: GET /api/tokens/");
            return Ok(new { message = $"API Endpoint for fetching single token price by {id} reached Successfully! " });
        }
    }
}
