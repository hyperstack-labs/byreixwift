/**
 * ITrendDataProvider
 *
 * Contract interface for all historical price / trend data sources.
 *
 * @integration-point Sidra Historical Price API
 */

export type TrendTimeRange = "1H" | "24H" | "7D" | "30D" | "1Y";

export interface TrendDataPoint {
  time: string;
  price: number;
}

export interface ITrendDataProvider {
  /**
   * Returns an ordered array of price points for a given token and
   * time window.
   *
   * @param symbol  - Ticker symbol, e.g. "SDA"
   * @param range   - One of the supported time ranges
   *
   * @integration-point
   *   Real implementation should call:
   *     GET /api/token/history?symbol=<symbol>&range=<range>
   *   Expected response schema:
   *     Array<{ timestamp: string; priceUsd: number }>
   *   Map `timestamp` → formatted `time` label and `priceUsd` → `price`.
   */
  getTrendData(symbol: string, range: TrendTimeRange): Promise<TrendDataPoint[]>;

  /**
   * Returns the set of time ranges supported by this provider.
   * The TrendViewPage uses this to build the range-selector buttons,
   * so adding "3M" or "ALL" in the real provider automatically
   * surfaces in the UI without further changes.
   *
   * @integration-point
   *   Could be derived from a capability-discovery endpoint, or simply
   *   hard-coded to what the Sidra history API supports.
   */
  getSupportedRanges(): TrendTimeRange[];
}