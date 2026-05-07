import { ITokenDataProvider } from "../ITokenDataProvider";
import { SidraTokenMetric } from "@/types/sidra";

const BASE_URL = process.env.NEXT_PUBLIC_SIDRA_API_URL ?? "https://localhost:3001/api";

async function sidraFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      // @integration-point: replace with real auth header once available
      // "X-Sidra-Key": process.env.NEXT_PUBLIC_SIDRA_API_KEY ?? "",
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`[SidraTokenDataProvider] ${res.status} ${res.statusText} — ${path}`);
  }

  return res.json() as Promise<T>;
}

export class SidraTokenDataProvider implements ITokenDataProvider {
  async getTokenList(): Promise<SidraTokenMetric[]> {
    // @integration-point: confirm endpoint path with Sidra API docs
    return sidraFetch<SidraTokenMetric[]>("/token/list");
  }

  async getTokenMetrics(symbol: string): Promise<SidraTokenMetric | undefined> {
    // @integration-point: confirm endpoint path with Sidra API docs
    return sidraFetch<SidraTokenMetric>(`/token/metrics?symbol=${encodeURIComponent(symbol)}`);
  }
}
