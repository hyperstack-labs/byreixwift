"use client";

import { useState } from "react";
import { Card, Button } from "../ui";
import { useSidraTokens } from "@/hooks/useSidraTokens";
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Mock data for different time ranges
const CHART_DATA = {
    "1H": Array.from({ length: 12 }, (_, i) => ({
        time: `${i * 5}m`,
        price: 2.0 + (i % 3) * 0.05 - 0.02,
    })),
    "24H": Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        price: 2.0 + (i % 5) * 0.1 - 0.05,
    })),
    "7D": Array.from({ length: 7 }, (_, i) => ({
        time: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        price: 1.8 + i * 0.04 + (i % 2) * 0.05,
    })),
    "30D": Array.from({ length: 30 }, (_, i) => ({
        time: `${i + 1}`,
        price: 1.6 + i * 0.015 + (i % 4) * 0.025,
    })),
    "1Y": Array.from({ length: 12 }, (_, i) => ({
        time: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        price: 1.0 + i * 0.1 + (i % 3) * 0.1,
    })),
};

export function TrendViewPage() {
    const [selectedToken, setSelectedToken] = useState("SDA");
    const [timeRange, setTimeRange] = useState("7D");

    const { data: realTokens, isLoading } = useSidraTokens();
    const tokens = realTokens ? realTokens.map(t => ({
        symbol: t.symbol,
        name: t.name,
        price: `$${t.priceUsd.toFixed(4)}`,
        change: `${t.change24h > 0 ? '+' : ''}${t.change24h}%`,
        positive: t.change24h >= 0
    })) : [
        { symbol: "SDA", name: "Sidra", price: "$2.00", change: "+12.5%", positive: true },
        { symbol: "BRXW", name: "ByReiXwift", price: "$0.15", change: "+5.2%", positive: true },
    ];

    const timeRanges = ["1H", "24H", "7D", "30D", "1Y"];

    const currentData = CHART_DATA[timeRange as keyof typeof CHART_DATA];
    const selectedTokenData = tokens.find((t) => t.symbol === selectedToken) || tokens[0];

    const stats = [
        { label: "Market Cap", value: realTokens ? `$${(realTokens.find(t => t.symbol === selectedToken)?.marketCap || 0).toLocaleString()}` : "$24.5B" },
        { label: "24h Volume", value: realTokens ? `$${(realTokens.find(t => t.symbol === selectedToken)?.volume24h || 0).toLocaleString()}` : "$1.2B" },
        { label: "Circulating Supply", value: "100 Billion SDA" },
        { label: "All Time High", value: "$3.45" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold">{selectedTokenData.name}</h2>
                        <span className="text-2xl text-[#A0A0A0]">{selectedToken}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold">{selectedTokenData.price}</span>
                        <span
                            className={`flex items-center gap-1 text-lg ${selectedTokenData.positive ? "text-[#26D578]" : "text-red-500"
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
                </div>

                <Button
                    variant="outline"
                    className="flex items-center gap-2 border-[#1E1E1E] bg-[#121212] hover:bg-[#1E1E1E]"
                >
                    <span className="font-semibold">{selectedToken}</span>
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </div>

            {/* Chart */}
            <Card className="p-6 bg-[#121212] border-[#1E1E1E]">
                {/* Time Range Selector */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Price Chart</h3>
                    <div className="flex items-center gap-2">
                        {timeRanges.map((range) => (
                            <Button
                                key={range}
                                variant={timeRange === range ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setTimeRange(range)}
                                className={
                                    timeRange === range
                                        ? "bg-[#26D578] text-black hover:bg-[#26D578]/90"
                                        : "text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]"
                                }
                            >
                                {range}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={currentData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#26D578" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#26D578" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
                            <XAxis
                                dataKey="time"
                                stroke="#A0A0A0"
                                style={{ fontSize: "12px" }}
                            />
                            <YAxis
                                stroke="#A0A0A0"
                                style={{ fontSize: "12px" }}
                                domain={["auto", "auto"]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#121212",
                                    border: "1px solid #1E1E1E",
                                    borderRadius: "8px",
                                    color: "#FFFFFF",
                                }}
                                labelStyle={{ color: "#A0A0A0" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#26D578"
                                strokeWidth={2}
                                fill="url(#colorPrice)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="p-4 bg-[#121212] border-[#1E1E1E]">
                        <p className="text-sm text-[#A0A0A0] mb-1">{stat.label}</p>
                        <p className="text-xl font-semibold">{stat.value}</p>
                    </Card>
                ))}
            </div>

            {/* Token List */}
            <Card className="p-6 bg-[#121212] border-[#1E1E1E]">
                <h3 className="text-lg font-semibold mb-4">All Tokens</h3>
                <div className="space-y-3">
                    {tokens.map((token) => (
                        <button
                            key={token.symbol}
                            onClick={() => setSelectedToken(token.symbol)}
                            className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${selectedToken === token.symbol
                                ? "bg-[#26D578]/10 border border-[#26D578]/50"
                                : "bg-[#0A0A0A] border border-[#1E1E1E] hover:border-[#26D578]/30"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#26D578]/10 flex items-center justify-center">
                                    <span className="text-sm font-bold text-[#26D578]">{token.symbol[0]}</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">{token.symbol}</p>
                                    <p className="text-sm text-[#A0A0A0]">{token.name}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{token.price}</p>
                                <p
                                    className={`text-sm ${token.positive ? "text-[#26D578]" : "text-red-500"
                                        }`}
                                >
                                    {token.change}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
}