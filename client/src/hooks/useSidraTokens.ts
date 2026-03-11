import { useQuery } from '@tanstack/react-query';
import { SidraTokenMetric } from '@/types/sidra';

async function fetchTokens(): Promise<SidraTokenMetric[]> {
  const res = await fetch('/api/mock/tokens');
  if (!res.ok) {
    throw new Error('Failed to fetch tokens');
  }
  return res.json();
}

export function useSidraTokens() {
  return useQuery({
    queryKey: ['sidraTokens'],
    queryFn: fetchTokens,
    // Polling is configured globally, but can be customized here if needed
  });
}
