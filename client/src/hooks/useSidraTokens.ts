import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SidraTokenMetric } from "@/types/sidra";
import { TokenService, USE_MOCK } from "@/services/tokenMetrics";


export const TOKEN_QUERY_KEYS = {
  list: ["sidraTokens"] as const,
  single: (symbol: string) => ["sidraTokenMetric", symbol] as const,
};


export function useSidraTokens(): UseQueryResult<SidraTokenMetric[]> {
  return useQuery({
    queryKey: TOKEN_QUERY_KEYS.list,
    queryFn: () => TokenService.getTokenList(USE_MOCK),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSidraTokenMetrics(
  symbol: string
): UseQueryResult<SidraTokenMetric | undefined> {
  return useQuery({
    queryKey: TOKEN_QUERY_KEYS.single(symbol),
    queryFn: () => TokenService.getTokenMetrics(symbol, USE_MOCK),
    enabled: Boolean(symbol),
    staleTime: 5 * 60 * 1000,
  });
}
 