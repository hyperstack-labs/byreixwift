const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7068";

export interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChangePercent24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

export interface TokenPrice {
  id: string;
  symbol: string;
  price: number;
  priceChangePercent24h: number;
  lastUpdated: string;
}

async function apiFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${message}`);
  }

  return res.json() as Promise<T>;
}

/** Fetch all tokens with their full details */
export const fetchTokens = (): Promise<Token[]> =>
  apiFetch<Token[]>("/api/tokens/all");

/** Fetch a single token by ID */
export const fetchTokenById = (id: string): Promise<Token> =>
  apiFetch<Token>(`/api/tokens/${id}`);

/** Fetch lightweight price-only data for all tokens (used for polling) */
export const fetchTokenPrices = (): Promise<TokenPrice[]> =>
  apiFetch<TokenPrice[]>("/api/tokens/prices");

/** Fetch the price of a single token */
export const fetchTokenPrice = (id: string): Promise<TokenPrice> =>
  apiFetch<TokenPrice>(`/api/tokens/${id}/price`);