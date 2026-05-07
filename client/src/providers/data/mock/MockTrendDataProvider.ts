/**
 * MockTrendDataProvider
 *
 * Implements ITrendDataProvider with deterministic synthetic data.
 * Previously this data lived as a `CHART_DATA` constant inside
 * TrendViewPage.tsx — it is now isolated here so the page component
 * has zero knowledge of its origin.
 *
 * @assumption  Price data is denominated in USD.
 * @assumption  All ranges return the same shape (TrendDataPoint[]) so
 *              the chart component never needs a conditional render path.
 * @assumption  The Sidra history API will eventually return data in a
 *              compatible shape; the SidraTrendDataProvider will map
 *              timestamps to the same `time` / `price` structure.
 */

import { ITrendDataProvider, TrendDataPoint, TrendTimeRange } from "../ITrendDataProvider";

const SUPPORTED_RANGES: TrendTimeRange[] = ["1H", "24H", "7D", "30D", "1Y"];

const MOCK_CHART_DATA: Record<TrendTimeRange, TrendDataPoint[]> = {
  "1H": Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 5}m`,
    price: Number((2.0 + (i % 3) * 0.05 - 0.02).toFixed(4)),
  })),
  "24H": Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: Number((2.0 + (i % 5) * 0.1 - 0.05).toFixed(4)),
  })),
  "7D": Array.from({ length: 7 }, (_, i) => ({
    time: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    price: Number((1.8 + i * 0.04 + (i % 2) * 0.05).toFixed(4)),
  })),
  "30D": Array.from({ length: 30 }, (_, i) => ({
    time: `${i + 1}`,
    price: Number((1.6 + i * 0.015 + (i % 4) * 0.025).toFixed(4)),
  })),
  "1Y": Array.from({ length: 12 }, (_, i) => ({
    time: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    price: Number((1.0 + i * 0.1 + (i % 3) * 0.1).toFixed(4)),
  })),
};

export class MockTrendDataProvider implements ITrendDataProvider {
  async getTrendData(_symbol: string, range: TrendTimeRange): Promise<TrendDataPoint[]> {
    // Simulate a small network delay
    await new Promise((r) => setTimeout(r, 100));
    // Mock data is the same for all symbols; SidraTrendDataProvider
    // will differentiate by symbol once the real API is available.
    return MOCK_CHART_DATA[range] ?? MOCK_CHART_DATA["7D"];
  }

  getSupportedRanges(): TrendTimeRange[] {
    return SUPPORTED_RANGES;
  }
}
