import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SidraTokenMetric } from "@/types/sidra";
import { DataProviderFactory } from "@/services/data/DataProviderFactory";

export const TOKEN_QUERY_KEYS = {
  list: ["sidraTokens"] as const,
  single: (symbol: string) => ["sidraTokenMetric", symbol] as const,
};
export function useSidraTokens(): UseQueryResult<SidraTokenMetric[]> {
  return useQuery({
    queryKey: TOKEN_QUERY_KEYS.list,
    queryFn: () => DataProviderFactory.getTokenProvider().getTokenList(),
    staleTime: 5 * 60 * 1000,
  });
}
export function useSidraTokenMetrics(symbol: string): UseQueryResult<SidraTokenMetric | undefined> {
  return useQuery({
    queryKey: TOKEN_QUERY_KEYS.single(symbol),
    queryFn: () => DataProviderFactory.getTokenProvider().getTokenMetrics(symbol),
    enabled: Boolean(symbol),
    staleTime: 5 * 60 * 1000,
  });
}
