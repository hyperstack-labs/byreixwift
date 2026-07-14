import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { TrendDataPoint, TrendTimeRange } from "@/services/data/ITrendDataProvider";
import { DataProviderFactory } from "@/services/data/DataProviderFactory";

export const TREND_QUERY_KEYS = {
  data: (symbol: string, range: TrendTimeRange) => ["trendData", symbol, range] as const,
  ranges: ["trendSupportedRanges"] as const,
};

export function useTrendData(
  symbol: string,
  range: TrendTimeRange
): UseQueryResult<TrendDataPoint[]> {
  return useQuery({
    queryKey: TREND_QUERY_KEYS.data(symbol, range),
    queryFn: () => DataProviderFactory.getTrendProvider().getTrendData(symbol, range),
    enabled: Boolean(symbol) && Boolean(range),
    staleTime: 2 * 60 * 1000,
    placeholderData: [],
  });
}

export function useSupportedRanges(): UseQueryResult<TrendTimeRange[]> {
  return useQuery({
    queryKey: TREND_QUERY_KEYS.ranges,
    queryFn: () => Promise.resolve(DataProviderFactory.getTrendProvider().getSupportedRanges()),
    staleTime: Infinity,
  });
}
