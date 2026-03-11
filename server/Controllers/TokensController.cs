using Microsoft.AspNetCore.Mvc;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TokensController : ControllerBase
    {
        private readonly List<TokenPrice> _tokenPrices;

        public TokensController()
        {
            // Mock data for token prices
             _tokenPrices = new List<TokenPrice>
{
    new TokenPrice { Id = 1, Symbol = "BTC",  Price = 67432.50, PriceChangePercent24h =  2.34,  LastUpdated = DateTime.UtcNow },
    new TokenPrice { Id = 2, Symbol = "ETH",  Price = 3521.18,  PriceChangePercent24h =  1.87,  LastUpdated = DateTime.UtcNow },
    new TokenPrice { Id = 3, Symbol = "SOL",  Price = 172.44,   PriceChangePercent24h =  5.12,  LastUpdated = DateTime.UtcNow },
    new TokenPrice { Id = 4, Symbol = "BNB",  Price = 598.30,   PriceChangePercent24h = -0.95,  LastUpdated = DateTime.UtcNow },
    new TokenPrice { Id = 5, Symbol = "XRP",  Price = 0.5821,   PriceChangePercent24h = -1.43,  LastUpdated = DateTime.UtcNow },
    new TokenPrice { Id = 6, Symbol = "ADA",  Price = 0.4673,   PriceChangePercent24h =  0.76,  LastUpdated = DateTime.UtcNow },
    new TokenPrice { Id = 7, Symbol = "AVAX", Price = 38.92,    PriceChangePercent24h =  3.21,  LastUpdated = DateTime.UtcNow },
    new TokenPrice { Id = 8, Symbol = "DOGE", Price = 0.1382,   PriceChangePercent24h = -2.67,  LastUpdated = DateTime.UtcNow },
    new TokenPrice { Id = 9, Symbol = "DOT",  Price = 7.84,     PriceChangePercent24h =  1.05,  LastUpdated = DateTime.UtcNow },
    new TokenPrice { Id = 10, Symbol = "LINK", Price = 14.27,   PriceChangePercent24h = -0.38,  LastUpdated = DateTime.UtcNow },
};
        }
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
            return Ok(_tokenPrices );
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
