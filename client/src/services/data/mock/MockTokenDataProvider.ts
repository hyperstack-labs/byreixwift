/**
 * MockTokenDataProvider
 *
 * Implements ITokenDataProvider using static in-memory data.
 * This is the ONLY file that should contain hardcoded token values.
 * Removing or replacing this file will not touch any page or hook.
 *
 * @assumption  SDA (Sidra Digital Asset) is the primary token on
 *              Sidrachain.  BRXW is the platform token used for fees
 *              inside ByReiXwift.  Both are stubbed at plausible but
 *              fictional prices until the official Sidra feed is live.
 *
 * @assumption  `priceUsd` is denominated in US dollars.  When Sidra
 *              publishes a native SAR or fiat-pair endpoint the
 *              SidraTokenDataProvider can expose a `priceFiat` field
 *              and the SidraTokenMetric type can be extended — mock
 *              data does not need to change.
 */

import { ITokenDataProvider } from "../ITokenDataProvider";
import { SidraTokenMetric } from "@/types/sidra";

const MOCK_TOKENS: SidraTokenMetric[] = [
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

export class MockTokenDataProvider implements ITokenDataProvider {
  async getTokenList(): Promise<SidraTokenMetric[]> {
    // Simulate realistic network latency
    await new Promise((r) => setTimeout(r, 120));
    return MOCK_TOKENS.map((t) => this._jitter(t));
  }

  async getTokenMetrics(symbol: string): Promise<SidraTokenMetric | undefined> {
    await new Promise((r) => setTimeout(r, 80));
    const token = MOCK_TOKENS.find((t) => t.symbol === symbol);
    return token ? this._jitter(token) : undefined;
  }

  /** Apply tiny random drift so the UI feels live during development. */
  private _jitter(token: SidraTokenMetric): SidraTokenMetric {
    const drift = (Math.random() - 0.5) * 0.01;
    return {
      ...token,
      priceUsd: Number((token.priceUsd * (1 + drift)).toFixed(4)),
      lastUpdated: new Date().toISOString(),
    };
  }
}
