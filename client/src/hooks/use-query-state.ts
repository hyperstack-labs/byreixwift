"use client";

import {useIsFetching, useIsMutating, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { queryKeys } from "@/lib/query-keys";

//Global loading & error states 

export function useGlobalLoading() {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    return isFetching > 0 || isMutating > 0;
}

export function useTokenSyncLoading() {
    const isFetching = useIsFetching( { queryKey: queryKeys.tokens.all });
    return isFetching > 0;
}

export interface QueryError {
    queryKey: readonly unknown[];
    error: Error;
}

export function useGlobalQueryErrors(): QueryError[] {
    const queryClient  = useQueryClient();
    const queryCache = queryClient.getQueryCache();

    return queryCache
        .getAll()
        .filter((query) => query.state.status === "error")
        .map((query) => ({
            queryKey: query.queryKey,
            error: query.state.error as Error,
        }));
}

export function useDataSync() {
    const queryClient = useQueryClient();
    
    const syncTokens = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tokens.all});
    }, [queryClient]);

    const syncPrices = useCallback(() => {
        queryClient.invalidateQueries( {queryKey: queryKeys.tokens.prices() });
    }, [queryClient]);

    const clearCache = useCallback(() => {
        queryClient.clear();
    }, [queryClient]);

    return {syncTokens, syncPrices, clearCache}
}
