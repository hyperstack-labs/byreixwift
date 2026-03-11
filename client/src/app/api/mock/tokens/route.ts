import { NextResponse } from 'next/server';
import { SidraTokenMetric } from '@/types/sidra';

// Generate some initial mock data
let mockTokens: SidraTokenMetric[] = [
  {
    id: "sidra-coin",
    symbol: "SDA",
    name: "Sidra Coin",
    priceUsd: 1.25,
    change24h: 2.4,
    volume24h: 15400000,
    marketCap: 250000000,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "byreixwift-token",
    symbol: "BRXW",
    name: "ByReiXwift",
    priceUsd: 0.15,
    change24h: 5.2,
    volume24h: 1200000,
    marketCap: 15000000,
    lastUpdated: new Date().toISOString()
  }
];

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // slightly randomize prices for "real-time" feel
  mockTokens = mockTokens.map(token => {
    const change = (Math.random() - 0.5) * 0.02; // ±1% max change
    const newPrice = token.priceUsd * (1 + change);
    return {
      ...token,
      priceUsd: Number(newPrice.toFixed(4)),
      change24h: Number((token.change24h + (Math.random() - 0.5) * 0.5).toFixed(2)),
      lastUpdated: new Date().toISOString()
    };
  });

  return NextResponse.json(mockTokens);
}
