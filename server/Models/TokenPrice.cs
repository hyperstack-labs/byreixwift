using System.Linq.Expressions;

namespace server.Models
{
    public class TokenPrice
    {
        public int Id { get; set; } = 1;

        public string? Symbol { get; set; } = "SDA";

        public double Price { get; set; } = 0.0;

        public double PriceChangePercent24h { get; set; } = 23.5;

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}
