/**
 * tokenMetrics.ts — Legacy shim
 *
 * This file previously contained MOCK_TOKENS, inline caching logic
 *
 * @deprecated — use hooks/useSidraTokens or DataProviderFactory instead.
 */

// import { DataProviderFactory, USE_MOCK } from "@/services/data/DataProviderFactory";
import { SidraTokenMetric } from "@/types/sidra";

// export { USE_MOCK };

/** @deprecated — mock data now lives in MockTokenDataProvider */
export const MOCK_TOKENS: SidraTokenMetric[] = [
  {
    id: "sidra-coin",
    symbol: "SDA",
    name: "Sidra Coin",
    priceUsd: 1.25,
    change24h: 2.4,
    volume24h: 15_400_000,
    marketCap: 250_000_000,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "byreixwift-token",
    symbol: "BRXW",
    name: "ByReiXwift",
    priceUsd: 0.15,
    change24h: 5.2,
    volume24h: 1_200_000,
    marketCap: 15_000_000,
    lastUpdated: new Date().toISOString(),
  },
];

/**
 * @deprecated — callers should use useSidraTokens() hook instead.
 */
// export const TokenService = {
//   getTokenList(_useMock = USE_MOCK): Promise<SidraTokenMetric[]> {
//     return DataProviderFactory.getTokenProvider().getTokenList();
//   },
//   getTokenMetrics(
//     symbol: string,
//     _useMock = USE_MOCK
//   ): Promise<SidraTokenMetric | undefined> {
//     return DataProviderFactory.getTokenProvider().getTokenMetrics(symbol);
//   },
//   clearCache(): void {
//     DataProviderFactory.reset();
//   },
// };
