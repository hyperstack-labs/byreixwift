"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchTokenById,
    fetchTokenPrice,
    fetchTokenPrices,
    fetchTokens,
    Token,
    TokenPrice
} from "@/lib/tokens.api";
import {queryKeys } from "@/lib/query-keys";

const PRICE_POLL_INTERVAL_MS = 15 * 1000;
const LIST_POLL_INTERVAL_MS = 30 * 1000;

export function useTokens() {
    return useQuery<Token[], Error>( {
        queryKey: queryKeys.tokens.list(),
        queryFn: fetchTokens,
        refetchInterval: LIST_POLL_INTERVAL_MS,
        refetchIntervalInBackground: false,
    });
}
//for single token fetching
export function useToken(id: string | null | undefined) {
    return useQuery<Token, Error> ( {
        queryKey: queryKeys.tokens.detail(id ?? ""),
        queryFn: () => fetchTokenById(id!),
        enabled: Boolean(id),
        refetchInterval: PRICE_POLL_INTERVAL_MS,
        refetchIntervalInBackground: false,
    });
}

//fetch price only on tickers
export function useTokenPrices() {
    return useQuery<TokenPrice[], Error> ({
        queryKey: queryKeys.tokens.prices(),
        queryFn: fetchTokenPrices,
        refetchInterval: PRICE_POLL_INTERVAL_MS,
        refetchIntervalInBackground: false,
        staleTime : 10 * 1000,
    })
}

//fetch price only on single token every 10s

export function useTokenPrice(id: string | null | undefined) {
    return useQuery<TokenPrice, Error> ({
        queryKey: queryKeys.tokens.price(id ?? ""),
        queryFn: () => fetchTokenPrice(id!),
        enabled: Boolean(id),
        refetchInterval: 10 * 1000,
        refetchIntervalInBackground: true,
        staleTime: 8 * 1000,
    });
}


//can be used to prefetch data such as hovering over a token in the token list will fetch the cached token data.
export function usePrefetchToken() {
    const queryClient = useQueryClient() ;

    return(id: string) => {
        queryClient.prefetchQuery( {
            queryKey: queryKeys.tokens.detail(id),
            queryFn: () => fetchTokenById(id),
            staleTime: 20 * 1000,
        });
    };
}
