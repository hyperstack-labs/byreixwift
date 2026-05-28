"use client";

import { useState, ChangeEvent } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import {
  ArrowDownUp,
  Settings,
  ChevronDown,
  Info,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useSidraTokens } from "@/hooks/useSidraTokens";

type TxStatus = "idle" | "pending" | "success" | "error";

interface ReceiptData {
  fromAmount: string;
  fromSymbol: string;
  toAmount: string;
  toSymbol: string;
  txHash: string;
  timestamp: string;
}

export function SwapPage() {
  const [fromToken, setFromToken] = useState({ symbol: "SDA", balance: "12,450.50" });
  const [toToken, setToToken] = useState({ symbol: "ETH", balance: "3.45" });
  const [fromAmount, setFromAmount] = useState("");
  const [slippage] = useState("0.5");

  // Latency State tracking
  const [isSwapping, setIsSwapping] = useState(false);
  // Persistent Receipt State
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: tokens, isLoading: isLoadingTokens, error: tokenError } = useSidraTokens();
  const fromTokenData = tokens?.find((t) => t.symbol === fromToken.symbol);
  const toTokenData = tokens?.find((t) => t.symbol === toToken.symbol);

  const fromPriceUsd = fromTokenData?.priceUsd || 0;
  const toPriceUsd = toTokenData?.priceUsd || 0;
  const numericAmount = parseFloat(fromAmount || "0");

  const conversionRate = fromPriceUsd && toPriceUsd ? fromPriceUsd / toPriceUsd : 0;

  // Derived state ensures the 'To' amount is always strictly synced mathematically
  const toAmount =
    fromAmount && numericAmount > 0 ? (numericAmount * conversionRate).toFixed(6) : "";

  const networkFeeUsd = 2.5;
  const usdValue = numericAmount * fromPriceUsd;
  const totalUsd = usdValue + networkFeeUsd;
  const priceImpact = numericAmount > 1000 ? 0.8 : 0.2;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFromAmount(e.target.value);
  };

  const handleSwapTokens = () => {
    if (isSwapping) return;
    const prevFrom = { ...fromToken };
    const prevTo = { ...toToken };
    setFromToken(prevTo);
    setToToken(prevFrom);
    setFromAmount(toAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error("Please enter an amount to swap");
      return;
    }

    if (parseFloat(fromAmount) > parseFloat(fromToken.balance.replace(/,/g, ""))) {
      toast.error("Insufficient balance");
      return;
    }

    setIsSwapping(true);
    setTxStatus("pending");
    setErrorMessage("");
    toast.info("Swap initiated! Transaction pending...");

    try {
      // Simulate real network performance that can realistically trigger a catch block
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            reject(new Error("Slippage limits exceeded due to sudden block congestion."));
          } else {
            resolve(true);
          }
        }, 2500);
      });

      const newReceipt = {
        fromAmount,
        fromSymbol: fromToken.symbol,
        toAmount,
        toSymbol: toToken.symbol,
        txHash: "0x7e4a...8f9c",
        timestamp: new Date().toLocaleTimeString(),
      };

      setReceipt(newReceipt);
      setTxStatus("success");
      toast.success(`Successfully swapped ${fromAmount} ${fromToken.symbol} to ${toToken.symbol}!`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Network routing timed out.";

      // Store and attach the simulated or real error message context to the receipt fallback view
      setErrorMessage(errorMsg);
      const partialReceipt = {
        fromAmount,
        fromSymbol: fromToken.symbol,
        toAmount,
        toSymbol: toToken.symbol,
        txHash: "0x0000...0000",
        timestamp: new Date().toLocaleTimeString(),
      };
      setReceipt(partialReceipt);
      setTxStatus("error");
      toast.error(`Swap execution failed: ${errorMsg}. Please try again.`);
    } finally {
      setIsSwapping(false);
    }
  };

  const resetForm = () => {
    setFromAmount("");
    setTxStatus("idle");
    setReceipt(null);
    setErrorMessage("");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-4 pb-20 md:pb-12 min-h-screen">
      {/* Conditional Receipt View */}
      {(txStatus === "success" || txStatus === "error") && receipt ? (
        <Card className="border-border bg-card p-6 md:p-8 shadow-sm animate-in fade-in zoom-in-95 duration-300 mb-8">
          <div className="flex flex-col items-center text-center space-y-4">
            {txStatus === "success" ? (
              <div className="rounded-full bg-green-500/10 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            ) : (
              <div className="rounded-full bg-red-500/10 p-3">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
            )}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">
                {txStatus === "success" ? "Swap Successful" : "Swap Failed"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {txStatus === "success"
                  ? "Your assets have been successfully routed."
                  : errorMessage || "The transaction could not be completed."}
              </p>
            </div>
            <div className="w-full rounded-xl bg-background border border-border p-4 mt-4 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Swapped</span>
                <span className="font-medium">
                  {receipt.fromAmount} {receipt.fromSymbol} to {receipt.toAmount} {receipt.toSymbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction Hash</span>
                <a
                  href="#"
                  className="flex items-center gap-1 text-primary hover:underline font-mono"
                >
                  {receipt.txHash} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{receipt.timestamp}</span>
              </div>
            </div>
            <Button onClick={resetForm} className="w-full mt-6 py-6 text-lg font-bold">
              {txStatus === "success" ? "Make Another Swap" : "Back to Swap"}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border-border bg-card p-5 md:p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-semibold">Swap Tokens</h2>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Swap settings"
              disabled={isSwapping}
              className="h-9 w-9 p-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {tokenError && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-500 animate-in fade-in duration-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Market Price Link Offline</p>
                <p className="text-muted-foreground mt-0.5">
                  Could not fetch baseline conversion rates. Displaying cached valuations.
                </p>
              </div>
            </div>
          )}

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
                  disabled={isSwapping}
                  onChange={handleInputChange}
                  className="h-auto flex-1 border-none bg-transparent p-0 text-3xl md:text-4xl focus-visible:ring-0 placeholder:text-muted-foreground/50"
                />
                <Button
                  variant="outline"
                  disabled={isSwapping}
                  className="flex items-center gap-2 border-border bg-card hover:bg-border h-10 px-3 shrink-0 cursor-pointer"
                >
                  <span className="font-bold">{fromToken.symbol}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                {isLoadingTokens ? (
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                ) : (
                  <span className="text-sm text-muted-foreground font-medium">
                    ≈ $
                    {usdValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
                <button
                  disabled={isSwapping}
                  onClick={() => {
                    const max = fromToken.balance.replace(/,/g, "");
                    setFromAmount(max);
                  }}
                  className="text-sm font-semibold text-primary hover:underline underline-offset-4 cursor-pointer disabled:opacity-50 disabled:no-underline"
                >
                  Use Maximum
                </button>
              </div>
            </div>

            <div className="relative z-10 -my-6 flex justify-center">
              <button
                aria-label="Reverse swap tokens"
                disabled={isSwapping}
                onClick={handleSwapTokens}
                className="flex h-10 w-10 items-center justify-center cursor-pointer rounded-full border border-border bg-card shadow-md transition-all hover:border-primary active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
                {isLoadingTokens ? (
                  <div className="h-9 w-36 bg-muted/60 rounded animate-pulse my-1" />
                ) : (
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={toAmount}
                    readOnly
                    className="h-auto flex-1 border-none bg-transparent p-0 text-3xl md:text-4xl focus-visible:ring-0"
                  />
                )}
                <Button
                  variant="outline"
                  disabled={isSwapping}
                  className="flex items-center gap-2 border-border bg-card hover:bg-border h-10 px-3 shrink-0 cursor-pointer"
                >
                  <span className="font-bold">{toToken.symbol}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {fromAmount && numericAmount > 0 && (
              <div className="space-y-3 rounded-xl border border-border bg-background p-4 animate-in fade-in zoom-in-95 duration-200">
                {isLoadingTokens ? (
                  <div className="space-y-3 py-1">
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                    <div className="h-5 w-1/2 bg-muted rounded animate-pulse pt-2" />
                  </div>
                ) : (
                  <>
                    {/* RATE */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rate</span>
                      <span className="text-foreground font-medium">
                        1 {fromToken.symbol} = {conversionRate.toFixed(6)} {toToken.symbol}
                      </span>
                    </div>

                    {/* USD VALUE */}
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

                    {/* PRICE IMPACT */}
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
                      <span className="text-foreground font-medium">
                        ${networkFeeUsd.toFixed(2)}
                      </span>
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
                  </>
                )}
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
              disabled={isSwapping || isLoadingTokens}
              className="w-full bg-primary hover:bg-primary/90 text-black py-7 text-lg cursor-pointer font-bold transition-all active:scale-[0.98]"
            >
              {isSwapping ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Swap...
                </>
              ) : fromAmount ? (
                "Review Swap"
              ) : (
                "Enter Amount"
              )}
            </Button>
          </div>
        </Card>
      )}

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
