"use client";


import { useSidraTokens } from "@/hooks/useSidraTokens";
import { Copy, RefreshCw, AlertCircle } from "lucide-react";
import { useState } from "react";

export function TokenPriceBoard() {
  const { data: tokens, isLoading, error, refetch, isFetching } = useSidraTokens();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
        <AlertCircle className="h-5 w-5" />
        <p>Failed to load token data: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Live Prices</h2>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2 text-[#A0A0A0] hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#26D578]" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse border border-white/5" />
            ))
          : tokens?.map((token) => (
              <div
                key={token.id}
                className="p-4 rounded-xl bg-[#121212] border border-white/5 hover:border-[#26D578]/50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg">{token.symbol}</span>
                    <span className="text-xs text-[#A0A0A0]">{token.name}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(token.id, token.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-md text-[#A0A0A0] hover:text-white"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold tracking-tight">
                      ${token.priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </div>
                    <div className="text-xs text-[#A0A0A0] mt-1">
                      Vol: ${(token.volume24h / 1000000).toFixed(2)}M
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    token.change24h >= 0 ? "text-[#26D578]" : "text-red-500"
                  }`}>
                    {token.change24h >= 0 ? "+" : ""}
                    {token.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}