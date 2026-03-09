"use client";

import { useState } from "react";
import { Card, Button, Input } from "../ui";
import { ArrowDownUp, Settings, ChevronDown, Info } from "lucide-react";
import { toast } from "sonner";

export function SwapPage() {
    const [fromToken, setFromToken] = useState({ symbol: "SDA", balance: "12,450.50" });
    const [toToken, setToToken] = useState({ symbol: "ETH", balance: "3.45" });
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [slippage] = useState("0.5");

    const handleSwapTokens = () => {
        const temp = fromToken;
        setFromToken(toToken);
        setToToken(temp);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
    };

    const handleSwap = () => {
        if (!fromAmount || parseFloat(fromAmount) <= 0) {
            toast.error("Please enter a valid amount to swap.");
            return;
        }
        toast.success("Swap has been successfully initiated. Transaction is pending confirmation.");
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="p-6 bg-[#121212] border-[#1E1E1E]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Swap Tokens</h2>
                    <Button variant="ghost" size="sm" className="text-[#A0A0A0]">
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>

                {/* From Token */}
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1E1E1E]">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm text-[#A0A0A0]">From</label>
                            <span className="text-sm text-[#A0A0A0]">
                                Balance: {fromToken.balance}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={fromAmount}
                                onChange={(e) => {
                                    setFromAmount(e.target.value);
                                    // Mock conversion rate
                                    setToAmount((parseFloat(e.target.value || "0") * 0.00042).toFixed(6));
                                }}
                                className="flex-1 bg-transparent border-none text-3xl p-0 h-auto focus-visible:ring-0"
                            />
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 border-[#1E1E1E] bg-[#121212] hover:bg-[#1E1E1E]"
                            >
                                <span className="font-semibold">{fromToken.symbol}</span>
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </div>
                        <button className="text-sm text-[#26D578] mt-2 hover:underline">
                            Use Maximum Balance
                        </button>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center -my-2 relative z-10">
                        <button
                            onClick={handleSwapTokens}
                            className="w-10 h-10 rounded-full bg-[#121212] border border-[#1E1E1E] flex items-center justify-center hover:border-[#26D578] transition-colors"
                        >
                            <ArrowDownUp className="w-5 h-5 text-[#A0A0A0]" />
                        </button>
                    </div>

                    {/* To Token */}
                    <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1E1E1E]">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm text-[#A0A0A0]">To</label>
                            <span className="text-sm text-[#A0A0A0]">
                                Balance: {toToken.balance}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={toAmount}
                                readOnly
                                className="flex-1 bg-transparent border-none text-3xl p-0 h-auto focus-visible:ring-0"
                            />
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 border-[#1E1E1E] bg-[#121212] hover:bg-[#1E1E1E]"
                            >
                                <span className="font-semibold">{toToken.symbol}</span>
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Swap Info */}
                    {fromAmount && (
                        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1E1E1E] space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#A0A0A0]">Rate</span>
                                <span className="text-white">1 {fromToken.symbol} = 0.00042 {toToken.symbol}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#A0A0A0]">Slippage Tolerance</span>
                                <span className="text-white">{slippage}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#A0A0A0]">Network Fee</span>
                                <span className="text-white">~$2.50</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#A0A0A0]">Minimum Received</span>
                                <span className="text-white">{(parseFloat(toAmount || "0") * 0.995).toFixed(6)} {toToken.symbol}</span>
                            </div>
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-[#26D578]/10 border border-[#26D578]/20">
                        <Info className="w-4 h-4 text-[#26D578] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#A0A0A0]">
                              Swaps are executed through multiple DEXs to ensure the optimal exchange rate.
                        </p>
                    </div>

                    {/* Swap Button */}
                    <Button
                        onClick={handleSwap}
                        className="w-full bg-[#26D578] hover:bg-[#26D578]/90 text-black py-6 text-lg"
                    >
                        {fromAmount ? "Swap Tokens" : "Please specify an amount"}
                    </Button>
                </div>
            </Card>

            {/* Recent Swaps */}
            <Card className="mt-6 p-6 bg-[#121212] border-[#1E1E1E]">
                <h3 className="text-lg font-semibold mb-4">Recent Swaps</h3>
                <div className="space-y-3">
                    {[
                        { from: "BTC", to: "SDA", amount: "0.05", time: "1 day ago" },
                        { from: "ETH", to: "USDT", amount: "1.2", time: "3 days ago" },
                        { from: "SDA", to: "BTC", amount: "5,000", time: "1 week ago" },
                    ].map((swap, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#1E1E1E]"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#26D578]/10 flex items-center justify-center">
                                    <ArrowDownUp className="w-4 h-4 text-[#26D578]" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        {swap.from} → {swap.to}
                                    </p>
                                    <p className="text-xs text-[#A0A0A0]">{swap.time}</p>
                                </div>
                            </div>
                            <span className="text-sm text-[#A0A0A0]">{swap.amount} {swap.from}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
