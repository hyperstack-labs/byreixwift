"use client";


import { useTokenPrices } from "@/hooks/use-token-data";
import { useTokenSyncLoading, useGlobalQueryErrors, useDataSync } from "@/hooks/use-query-state";

export function TokenPriceBoard() {
  const { data: prices, isLoading, isError, error } = useTokenPrices();

  const isSyncing = useTokenSyncLoading();

  const errors = useGlobalQueryErrors();

  const { syncPrices } = useDataSync();

  // ── First-load skeleton ────────────────────────────────────────────────────
  if (isLoading) {
    return <div className="animate-pulse">Loading prices…</div>;
  }

  // ── Hard error (all retries exhausted) ────────────────────────────────────
  if (isError) {
    return (
      <div className="text-red-500">
        Failed to load prices: {error.message}
        <button onClick={syncPrices} className="ml-2 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/*Subtle sync indicator (background re-fetch in progress) */}
      {isSyncing && (
        <span className="text-xs text-gray-400 animate-pulse">Syncing…</span>
      )}

      {/*Surface non-fatal errors as banners */}
      {errors.length > 0 && (
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm rounded mb-2">
          Some data may be stale — {errors.length} sync error(s)
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Symbol</th>
            <th className="text-right">Price</th>
            <th className="text-right">24h %</th>
          </tr>
        </thead>
        <tbody>
          {prices?.map((token) => (
            <tr key={token.id}>
              <td>{token.symbol}</td>
              <td className="text-right">${token.price.toLocaleString()}</td>
              <td
                className={`text-right ${
                  token.priceChangePercent24h >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {token.priceChangePercent24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}