"use client";

import { useState } from "react";
import { Card, Button, Input, Label } from "../ui";
import { ArrowDownUp, Settings, ChevronDown, Info } from "lucide-react";
import { toast } from "sonner";
import { useSidraTokens } from "@/hooks/useSidraTokens";

export function SwapPage() {
  const [fromToken, setFromToken] = useState({ symbol: "SDA", balance: "12,450.50" });
  const [toToken, setToToken] = useState({ symbol: "ETH", balance: "3.45" });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage] = useState("0.5");

  const { data: tokens } = useSidraTokens();
  const fromTokenData = tokens?.find((t) => t.symbol === fromToken.symbol);
  const toTokenData = tokens?.find((t) => t.symbol === toToken.symbol);

  const fromPriceUsd = fromTokenData?.priceUsd || 0;
  const toPriceUsd = toTokenData?.priceUsd || 0;
  const numericAmount = parseFloat(fromAmount || "0");

  const networkFeeUsd = 2.5;
  const usdValue = numericAmount * fromPriceUsd;
  const totalUsd = usdValue + networkFeeUsd;
  const priceImpact = numericAmount > 1000 ? 0.8 : 0.2;

  const handleSwapTokens = () => {
    const prevFrom = { ...fromToken };
    const prevTo = { ...toToken };
    setFromToken(prevTo);
    setToToken(prevFrom);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const conversionRate = fromPriceUsd && toPriceUsd ? fromPriceUsd / toPriceUsd : 0;

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error("Please enter an amount to swap");
      return;
    }
    toast.success("Swap initiated! Transaction pending...");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-4 pb-20 md:pb-12 min-h-screen">
      <Card className="border-border bg-card p-5 md:p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold">Swap Tokens</h2>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Swap settings"
            className="h-9 w-9 p-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-4 transition-colors focus-within:border-primary/40">
            <div className="mb-2 flex items-center justify-between px-1">
              <Label className="text-sm font-medium">From</Label>
              <span className="text-xs text-muted-foreground">Balance: {fromToken.balance}</span>
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value || "0");
                  setFromAmount(e.target.value);
                  setToAmount((value * conversionRate).toFixed(6));
                }}
                className="h-auto flex-1 border-none bg-transparent p-0 text-3xl md:text-4xl focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
              <Button
                variant="outline"
                className="flex items-center gap-2 border-border bg-card hover:bg-border h-10 px-3 shrink-0"
              >
                <span className="font-bold">{fromToken.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-between px-1">
              <span className="text-sm text-muted-foreground font-medium">
                ≈ $
                {usdValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <button
                onClick={() => {
                  const max = fromToken.balance.replace(/,/g, "");
                  setFromAmount(max);
                  setToAmount((parseFloat(max) * conversionRate).toFixed(6));
                }}
                className="text-sm font-semibold text-primary hover:underline underline-offset-4 cursor-pointer"
              >
                Use Maximum
              </button>
            </div>
          </div>

          <div className="relative z-10 -my-6 flex justify-center">
            <button
              aria-label="Reverse swap tokens"
              onClick={handleSwapTokens}
              className="flex h-10 w-10 items-center justify-center cursor-pointer rounded-full border border-border bg-card shadow-md transition-all hover:border-primary active:scale-90"
            >
              <ArrowDownUp className="h-5 w-5 text-primary" />
            </button>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-2 flex items-center justify-between px-1">
              <Label className="text-sm font-medium">To</Label>
              <span className="text-xs text-muted-foreground">Balance: {toToken.balance}</span>
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="0.00"
                value={toAmount}
                readOnly
                className="h-auto flex-1 border-none bg-transparent p-0 text-3xl md:text-4xl focus-visible:ring-0"
              />
              <Button
                variant="outline"
                className="flex items-center gap-2 border-border bg-card hover:bg-border h-10 px-3 shrink-0"
              >
                <span className="font-bold">{toToken.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {fromAmount && numericAmount > 0 && (
            <div className="space-y-3 rounded-xl border border-border bg-background p-4 animate-in fade-in zoom-in-95 duration-200">
              {/* RATE */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span className="text-foreground font-medium">
                  1 {fromToken.symbol} = {conversionRate.toFixed(6)} {toToken.symbol}
                </span>
              </div>

              {/* USD VALUE  */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Value (USD)</span>
                <span className="text-foreground font-medium">
                  $
                  {usdValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* PRICE IMPACT  */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Price Impact</span>
                <span className={priceImpact > 0.5 ? "text-yellow-500" : "text-green-500"}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>

              {/* SLIPPAGE */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Slippage Tolerance</span>
                <span className="text-foreground font-medium">{slippage}%</span>
              </div>

              {/* NETWORK FEE */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Network Fee</span>
                <span className="text-foreground font-medium">${networkFeeUsd.toFixed(2)}</span>
              </div>

              {/* MIN RECEIVED */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Minimum Received</span>
                <span className="text-foreground font-medium">
                  {(parseFloat(toAmount || "0") * 0.995).toFixed(6)} {toToken.symbol}
                </span>
              </div>

              {/* TOTAL COST  */}
              <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                <span className="font-medium">Total Cost</span>
                <span className="text-foreground font-bold">
                  $
                  {totalUsd.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground leading-normal">
              This interface is for previewing swap quotes. Live asset routing and smart contract
              execution are currently in development.
            </p>
          </div>

          <Button
            onClick={handleSwap}
            className="w-full bg-primary hover:bg-primary/90 text-black py-7 text-lg cursor-pointer font-bold transition-all active:scale-[0.98]"
          >
            {fromAmount ? "Review Swap" : "Enter Amount"}
          </Button>
        </div>
      </Card>

      {/* Recent Activity Section */}
      <div className="mt-8 space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            { from: "BTC", to: "SDA", amount: "0.05", time: "1 day ago" },
            { from: "ETH", to: "USDT", amount: "1.2", time: "3 days ago" },
            { from: "SDA", to: "BTC", amount: "5,000", time: "1 week ago" },
          ].map((swap, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <ArrowDownUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {swap.from} <span className="text-muted-foreground/50 mx-1">→</span> {swap.to}
                  </p>
                  <p className="text-xs text-muted-foreground">{swap.time}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-foreground">
                {swap.amount} {swap.from}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
