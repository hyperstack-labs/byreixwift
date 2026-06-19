"use client";
import { useBalance } from "wagmi";
import { sidrachain } from "@/providers/Web3Provider";
import { formatUnits } from "viem";
import { keepPreviousData } from "@tanstack/react-query";
import { useAuthStore } from "@/store";

// Custom hook to fetch and format SDA balance for the authenticated user
export function useSdaBalance() {
  const { identity, isAuthenticated } = useAuthStore();

  // Safely cast identity string to a valid Ethereum address type
  const address = isAuthenticated && identity ? (identity as `0x${string}`) : undefined;

  const { data, isLoading, error, refetch, isError } = useBalance({
    address,
    chainId: sidrachain.id,
    query: {
      enabled: !!address,
      refetchInterval: 10_000,
      staleTime: 4_000,
      placeholderData: keepPreviousData,
    },
  });

  // Calculate the numeric balance for mathematical operations
  const balance = data ? parseFloat(formatUnits(data.value, data.decimals)) : 0;

  // Format balance string for ui display
  const formatted = data
    ? parseFloat(formatUnits(data.value, data.decimals)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      })
    : "0.00";

  return {
    balance,
    formatted,
    symbol: data?.symbol ?? "SDA",
    // isLoading is true only on initial mount before first data resolution
    isLoading: isLoading && !data,
    // hasValue flag helps components decide if they should render data or placeholders
    hasValue: !!data,
    isError,
    error,
    refetch,
  };
}
