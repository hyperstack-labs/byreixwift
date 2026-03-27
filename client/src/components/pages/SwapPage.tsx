"use client";

import { useState } from "react";
import { Card, Button, Input } from "../ui";
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
  const fromTokenData = tokens?.find(t => t.symbol === fromToken.symbol);
  const toTokenData = tokens?.find(t => t.symbol === toToken.symbol);

  const fromPriceUsd = fromTokenData?.priceUsd || 0;
  const toPriceUsd = toTokenData?.priceUsd || 0;
  const numericAmount = parseFloat(fromAmount || "0");

  const networkFeeUsd = 2.5;
  const usdValue = numericAmount * fromPriceUsd;
  const totalUsd = usdValue + networkFeeUsd;
  const priceImpact = numericAmount > 1000 ? 0.8 : 0.2;

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const conversionRate = fromPriceUsd && toPriceUsd
  ? fromPriceUsd / toPriceUsd
  : 0;

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error("Please enter an amount to swap");
      return;
    }
    toast.success("Swap initiated! Transaction pending...");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-border bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Swap Tokens</h2>
          <Button variant="ghost" size="sm" aria-label="Swap settings">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-muted-foreground">From</label>
              <span className="text-sm text-muted-foreground">Balance: {fromToken.balance}</span>
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value || "0");
                  setFromAmount(e.target.value);
                  setToAmount((value * conversionRate).toFixed(6));
                }}
                className="h-auto flex-1 border-none bg-transparent p-0 text-3xl focus-visible:ring-0"
              />
              <Button
                variant="outline"
                className="flex items-center gap-2 border-border bg-card hover:bg-border"
              >
                <span className="font-semibold">{fromToken.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <button
              onClick={() => setFromAmount(fromToken.balance.replace(/,/g, ""))}
              className="text-sm text-primary"
            >
              Maximum
            </button>
          </div>

          <div className="relative z-10 -my-2 flex justify-center">
            <button
              aria-label="Reverse swap tokens"
              onClick={handleSwapTokens}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-primary"
            >
              <ArrowDownUp className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-muted-foreground">To</label>
              <span className="text-sm text-muted-foreground">Balance: {toToken.balance}</span>
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="0.00"
                value={toAmount}
                readOnly
                className="h-auto flex-1 border-none bg-transparent p-0 text-3xl focus-visible:ring-0"
              />
              <Button
                variant="outline"
                className="flex items-center gap-2 border-border bg-card hover:bg-border"
              >
                <span className="font-semibold">{toToken.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {fromAmount && (
              <div className="space-y-2 rounded-xl border border-border bg-background p-4">
              
                {/* RATE */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rate</span>
                  <span className="text-foreground">
                    1 {fromToken.symbol} = {conversionRate.toFixed(6)} {toToken.symbol}
                  </span>
                </div>

                {/* USD VALUE  */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Value (USD)</span>
                  <span className="text-foreground">
                    ${usdValue.toFixed(2)}
                  </span>
                </div>

                {/* PRICE IMPACT  */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price Impact</span>
                  <span className="text-yellow-500">
                    {priceImpact.toFixed(2)}%
                  </span>
                </div>

                {/* SLIPPAGE */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Slippage Tolerance</span>
                  <span className="text-foreground">{slippage}%</span>
                </div>

                {/* NETWORK FEE */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span className="text-foreground">
                    ${networkFeeUsd.toFixed(2)}
                  </span>
                </div>

                {/* MIN RECEIVED */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Minimum Received</span>
                  <span className="text-foreground">
                    {(parseFloat(toAmount || "0") * 0.995).toFixed(6)} {toToken.symbol}
                  </span>
                </div>

                {/* TOTAL COST  */}
                <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Total Cost</span>
                  <span className="text-foreground font-semibold">
                    ${totalUsd.toFixed(2)}
                  </span>
                </div>

              </div>
            )}

          <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/10 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              This swap surface currently previews the quote flow while live routing is still being
              integrated.
            </p>
          </div>

          <Button
            onClick={handleSwap}
            className="w-full bg-primary py-6 text-lg text-black hover:bg-primary/90"
          >
            {fromAmount ? "Swap Tokens" : "Enter Amount"}
          </Button>
        </div>
      </Card>

      <Card className="mt-6 border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Recent Swaps</h3>
        <div className="space-y-3">
          {[
            { from: "BTC", to: "SDA", amount: "0.05", time: "1 day ago" },
            { from: "ETH", to: "USDT", amount: "1.2", time: "3 days ago" },
            { from: "SDA", to: "BTC", amount: "5,000", time: "1 week ago" },
          ].map((swap, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <ArrowDownUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {swap.from}
                    {" -> "}
                    {swap.to}
                  </p>
                  <p className="text-xs text-muted-foreground">{swap.time}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {swap.amount} {swap.from}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
