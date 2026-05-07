import { ITrendDataProvider, TrendDataPoint, TrendTimeRange } from "../ITrendDataProvider";

const BASE_URL = process.env.NEXT_PUBLIC_SIDRA_API_URL ?? "http://localhost:3001/api";

const SIDRA_SUPPORTED_RANGES: TrendTimeRange[] = ["1H", "24H", "7D", "30D", "1Y"];

/** @integration-point Adjust format logic to match actual API timestamp shape */
function formatLabel(timestamp: string, range: TrendTimeRange): string {
  const date = new Date(timestamp);
  switch (range) {
    case "1H":
      return `${date.getMinutes()}m`;
    case "24H":
      return `${date.getHours()}:00`;
    case "7D":
      return date.toLocaleDateString("en-US", { weekday: "short" });
    case "30D":
      return `${date.getDate()}`;
    case "1Y":
      return date.toLocaleDateString("en-US", { month: "short" });
  }
}

interface SidraHistoryPoint {
  /** @integration-point Confirm field name in actual Sidra API response */
  timestamp: string;
  priceUsd: number;
}

export class SidraTrendDataProvider implements ITrendDataProvider {
  async getTrendData(symbol: string, range: TrendTimeRange): Promise<TrendDataPoint[]> {
    const url = `${BASE_URL}/token/history?symbol=${encodeURIComponent(symbol)}&range=${range}`;

    const res = await fetch(url, {
      headers: {
        // @integration-point: add auth header once available
        "Content-Type": "application/json",
      },
      next: {
        // shorter revalidation for tighter ranges
        revalidate: range === "1H" || range === "24H" ? 60 : 3600,
      },
    });

    if (!res.ok) {
      throw new Error(`[SidraTrendDataProvider] ${res.status} ${res.statusText} — ${url}`);
    }

    const raw: SidraHistoryPoint[] = await res.json();

    return raw.map((point) => ({
      time: formatLabel(point.timestamp, range),
      price: point.priceUsd,
    }));
  }

  getSupportedRanges(): TrendTimeRange[] {
    return SIDRA_SUPPORTED_RANGES;
  }
}
