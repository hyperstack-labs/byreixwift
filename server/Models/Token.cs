namespace server.Models
{
    public class Token
    {
        public int? Id { get; set; } 

        public string? Symbol { get; set; }

        public double Price { get; set; }

        public double PriceChangePercent24h { get; set;  }

        public double Volume24 { get; set; } 

        public double MarketCap { get; set; }

        public DateTime LastUpdated { get; set; }



    }
}
