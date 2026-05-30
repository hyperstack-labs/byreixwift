"use client";

import { useState } from "react";
import { Card, Button } from "../ui";
import { useSidraTokens } from "@/hooks/useSidraTokens";
import { useTrendData, useSupportedRanges } from "@/hooks/useTrendData";
import { TrendTimeRange } from "@/providers/data/ITrendDataProvider";
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function TrendViewPage() {
  const [selectedToken, setSelectedToken] = useState<string>("SDA");
  const [timeRange, setTimeRange] = useState<TrendTimeRange>("7D");

  const formatPrice = (value: number) => `$${value.toFixed(4)}`;

  // Token list — sourced from the active provider via hook
  const {
    data: realTokens,
    isLoading: isLoadingTokens,
    error: tokenError,
    refetch: refetchTokens,
  } = useSidraTokens();

  // Historical chart data — sourced from the active trend provider via hook
  const {
    data: currentData = [],
    isLoading: isLoadingTrends,
    error: trendError,
    refetch: refetchTrends,
  } = useTrendData(selectedToken, timeRange);

  // Range buttons driven by the provider's capability declaration
  const { data: timeRanges = ["1H", "24H", "7D", "30D", "1Y"] } = useSupportedRanges();

  const handleTokenChange = (symbol: string) => {
    setSelectedToken(symbol);
  };

  const handleTimeRangeChange = (range: TrendTimeRange) => {
    setTimeRange(range);
  };

  const tokens = realTokens
    ? realTokens.map((t) => ({
        symbol: t.symbol,
        name: t.name,
        price: formatPrice(t.priceUsd),
        change: `${t.change24h > 0 ? "+" : ""}${t.change24h}%`,
        positive: t.change24h >= 0,
      }))
    : [
        { symbol: "SDA", name: "Sidra", price: "$2.00", change: "+12.5%", positive: true },
        { symbol: "BRXW", name: "ByReiXwift", price: "$0.15", change: "+5.2%", positive: true },
      ];

  const currentToken = realTokens?.find((t) => t.symbol === selectedToken);
  const selectedTokenData = tokens.find((t) => t.symbol === selectedToken) || tokens[0];

  const stats = [
    {
      label: "Market Cap",
      value: currentToken ? `$${currentToken.marketCap.toLocaleString()}` : "$250,000,000",
    },
    {
      label: "24h Volume",
      value: currentToken ? `$${currentToken.volume24h.toLocaleString()}` : "$15,400,000",
    },
    { label: "Circulating Supply", value: "100 Billion SDA" },
    { label: "All Time High", value: "$3.45" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="space-y-2 w-full md:w-auto">
          {isLoadingTokens ? (
            <div className="space-y-3 py-1">
              <div className="h-9 w-48 bg-muted rounded animate-pulse" />
              <div className="h-10 w-64 bg-muted/70 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                  {selectedTokenData.name}
                </h2>
                <span className="text-xl font-medium text-muted-foreground">{selectedToken}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold tabular-nums">{selectedTokenData.price}</span>
                <span
                  className={`flex items-center gap-1 text-lg font-bold ${
                    selectedTokenData.positive ? "text-primary" : "text-red-500"
                  }`}
                >
                  {selectedTokenData.positive ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  {selectedTokenData.change}
                </span>
              </div>
            </>
          )}
        </div>

        <Button
          variant="outline"
          disabled={isLoadingTokens || isLoadingTrends}
          className="flex items-center gap-2 border-border bg-card hover:bg-muted h-12 px-6 rounded-xl cursor-pointer w-full md:w-auto justify-between md:justify-center"
        >
          <span className="font-bold">{selectedToken}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </div>

      {/* Chart */}
      <Card className="p-4 md:p-8 bg-card border-border shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            Market Performance
            {isLoadingTrends && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </h3>
          <div className="flex items-center gap-1 p-1 bg-background/50 rounded-xl border border-border overflow-x-auto max-w-full">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                disabled={isLoadingTrends}
                onClick={() => handleTimeRangeChange(range as TrendTimeRange)}
                className={`text-xs font-black transition-all cursor-pointer ${
                  timeRange === range
                    ? "bg-primary text-black hover:bg-primary/90 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                }`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-75 md:h-100 w-full relative">
          {trendError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/50 border border-red-500/20 p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <h4 className="text-base font-bold tracking-tight text-foreground">
                Failed to Sync Market Metrics
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs mt-1">
                A connection issue occurred while fetching trend data.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchTrends()}
                className="mt-4 h-9 border-border text-xs font-bold gap-2"
              >
                <RefreshCw className="w-3 h-3" />
                Retry Connection
              </Button>
            </div>
          ) : isLoadingTrends ? (
            <div className="absolute inset-0 flex flex-col justify-between p-2 animate-pulse">
              <div className="w-full flex justify-between border-b border-border/30 pb-4">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-3 w-12 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
              <div className="flex-1 flex items-end gap-2 px-6 py-4">
                <div className="w-full h-[25%] bg-muted/40 rounded-t" />
                <div className="w-full h-[50%] bg-muted/30 rounded-t" />
                <div className="w-full h-[40%] bg-muted/50 rounded-t" />
                <div className="w-full h-[65%] bg-muted/40 rounded-t" />
                <div className="w-full h-[45%] bg-muted/30 rounded-t" />
                <div className="w-full h-[80%] bg-muted/60 rounded-t" />
              </div>
              <div className="w-full flex justify-between pt-2 border-t border-border/30">
                <div className="h-3 w-10 bg-muted/80 rounded" />
                <div className="h-3 w-10 bg-muted/80 rounded" />
                <div className="h-3 w-10 bg-muted/80 rounded" />
              </div>
            </div>
          ) : currentData.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center mb-3">
                <span className="text-sm font-black text-muted-foreground">?</span>
              </div>
              <h4 className="text-sm font-bold tracking-tight">No Historical Index Found</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                There is currently no trend metadata parsed within this specific timeframe.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  opacity={0.4}
                />
                <XAxis
                  dataKey="time"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={["dataMin", "auto"]}
                  tickFormatter={(val) => `$${val.toFixed(2)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-5 bg-card border-border shadow-sm group hover:border-primary/30 transition-colors"
          >
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
              {stat.label}
            </p>
            {isLoadingTokens ? (
              <div className="h-8 w-2/3 bg-muted rounded animate-pulse mt-1" />
            ) : (
              <p className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                {stat.value}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Token List */}
      <Card className="p-6 bg-card border-border shadow-lg">
        <h3 className="text-lg font-bold tracking-tight mb-6">Market Watchlist</h3>
        {tokenError ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-center">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm font-medium">Could not retrieve watchlists.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchTokens()}
              className="mt-3 h-8 text-xs font-bold gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              Retry Fetch
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {isLoadingTokens
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/20 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-12 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted/70 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col items-end">
                      <div className="h-4 w-16 bg-muted rounded" />
                      <div className="h-3 w-10 bg-muted/70 rounded" />
                    </div>
                  </div>
                ))
              : tokens.map((token) => (
                  <button
                    key={token.symbol}
                    disabled={isLoadingTrends}
                    onClick={() => handleTokenChange(token.symbol)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border active:scale-[0.98] ${
                      selectedToken === token.symbol
                        ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20"
                        : "bg-background/40 border-transparent hover:border-border hover:bg-background"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="text-sm font-bold text-primary">
                          {token.symbol?.[0] ?? "?"}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-base leading-tight">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase mt-0.5">
                          {token.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-base tabular-nums leading-tight">
                        {token.price}
                      </p>
                      <p
                        className={`text-xs font-bold mt-0.5 ${token.positive ? "text-primary" : "text-red-500"}`}
                      >
                        {token.change}
                      </p>
                    </div>
                  </button>
                ))}
          </div>
        )}
      </Card>
    </div>
  );
}
