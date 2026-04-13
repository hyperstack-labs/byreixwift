import { SidraTokenMetric } from "@/types/sidra";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const MOCK_TOKENS: SidraTokenMetric[] = [
  {
    id: "001",
    symbol: "SDA",
    name: "Sidra Digital Asset",
    priceUsd: 1.25,
    change24h: 5.4,
    volume24h: 15_400_000,
    marketCap: 250_000_000,
    lastUpdated: new Date().toISOString(),
  }
];

let _listCache: SidraTokenMetric[] | null = null;
let _listInflight: Promise<SidraTokenMetric[]> | null = null;


const _symbolCache = new Map<string, SidraTokenMetric>();
const _symbolInflight = new Map<string, Promise<SidraTokenMetric>>();


async function safeFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`[TokenService] ${res.status} ${res.statusText} — ${url}`);
  }
  return res.json() as Promise<T>;
}



export const TokenService = {
  async getTokenList(useMock = USE_MOCK): Promise<SidraTokenMetric[]> {
    if (useMock) return MOCK_TOKENS;
    if (_listCache) return _listCache;
    if (_listInflight) return _listInflight;

    _listInflight = safeFetch<SidraTokenMetric[]>(
      `${API_BASE_URL}/api/token/list`
    )
      .then((data) => {
        _listCache = data;
        _listInflight = null;
        return data;
      })
      .catch((err) => {
        _listInflight = null;
        throw err;
      });

    return _listInflight;
  },
  async getTokenMetrics(
    symbol: string,
    useMock = USE_MOCK
  ): Promise<SidraTokenMetric | undefined> {
    if (useMock) return MOCK_TOKENS.find((t) => t.symbol === symbol);

    if (_listCache) return _listCache.find((t) => t.symbol === symbol);

    if (_symbolCache.has(symbol)) return _symbolCache.get(symbol);
    if (_symbolInflight.has(symbol)) return _symbolInflight.get(symbol);

    const promise = safeFetch<SidraTokenMetric>(
      `${API_BASE_URL}/api/token/metrics?symbol=${encodeURIComponent(symbol)}`
    )
      .then((data) => {
        _symbolCache.set(symbol, data);
        _symbolInflight.delete(symbol);
        return data;
      })
      .catch((err) => {
        _symbolInflight.delete(symbol);
        throw err;
      });

    _symbolInflight.set(symbol, promise);
    return promise;
  },

  clearCache(): void {
    _listCache = null;
    _listInflight = null;
    _symbolCache.clear();
    _symbolInflight.clear();
  },
};