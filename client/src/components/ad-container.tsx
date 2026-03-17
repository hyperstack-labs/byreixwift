"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdPlaceholder } from "./ad-placeholder";

export const AdContainer = ({ simulateError = false }: { simulateError?: boolean }) => {
  // Initialize states
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const loadAd = useCallback(() => {
    setStatus("loading");

    setTimeout(() => {
      if (simulateError) {
        setStatus("error");
      } else {
        setStatus("ready");
      }
    }, 2000);
  }, [simulateError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (simulateError) {
        setStatus("error");
      } else {
        setStatus("ready");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [simulateError]);

  return (
    <div className="w-full my-6">
      {/* Loading Skeleton */}
      {status === "loading" && <AdPlaceholder isLoading={true} />}

      {/* Error state */}
      {status === "error" && <AdPlaceholder isFallback={true} onRetry={loadAd} />}

      {/* Success state */}
      {status === "ready" && (
        <div className="w-full min-h-45 md:min-h-50 border border-border bg-linear-to-b from-card to-background rounded-2xl flex items-center justify-center overflow-hidden relative group">
          <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <span className="text-white/50 text-[9px] uppercase tracking-[0.4em] font-bold">
            Managed Advertisement Space
          </span>
        </div>
      )}
    </div>
  );
};
