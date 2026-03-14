"use client";

import { useState } from "react";
import { Button, Card, Tabs, TabsContent, TabsList, TabsTrigger } from "../ui";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Eye, EyeOff, Copy, ExternalLink } from "lucide-react";
import { SwapPage } from "./SwapPage";
import { SendPage } from "./SendPage";
import { TrendViewPage } from "./TrendViewPage";
import { toast } from "sonner";
import Image from "next/image";
import { AdSlot, BannerAd, BannerAdSize } from "@/components/ads";

export function WalletDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [balanceVisible, setBalanceVisible] = useState(true);

    const tokens = [
        {
            symbol: "SDA",
            name: "Sidra",
            amount: "12,450.50",
            usdValue: "$24,901.00",
            change: "+12.5%",
            changePositive: true,
            icon: "/token_sdr.png",
        },
        {
            symbol: "ETH",
            name: "Ethereum",
            amount: "3.45",
            usdValue: "$8,625.00",
            change: "+5.2%",
            changePositive: true,
            icon: "/token_eth.png",
        },
        {
            symbol: "BTC",
            name: "Bitcoin",
            amount: "0.15",
            usdValue: "$6,450.00",
            change: "-2.1%",
            changePositive: false,
            icon: "/token_btc.png",
        },
        {
            symbol: "USDT",
            name: "Tether",
            amount: "5,000.00",
            usdValue: "$5,000.00",
            change: "+0.01%",
            changePositive: true,
            icon: "/token_usdt.png",
        },
    ];

    const transactions = [
        {
            type: "send",
            token: "SDA",
            amount: "-250.00",
            usdValue: "-$500.00",
            to: "0x742d...9aB8",
            time: "2 hours ago",
            status: "completed",
        },
        {
            type: "receive",
            token: "ETH",
            amount: "+1.5",
            usdValue: "+$3,750.00",
            from: "0x9f3a...7cD2",
            time: "5 hours ago",
            status: "completed",
        },
        {
            type: "swap",
            token: "BTC → SDA",
            amount: "0.05 BTC",
            usdValue: "$2,150.00",
            time: "1 day ago",
            status: "completed",
        },
        {
            type: "send",
            token: "USDT",
            amount: "-1,000.00",
            usdValue: "-$1,000.00",
            to: "0x5e8b...4fA1",
            time: "2 days ago",
            status: "completed",
        },
    ];

    const totalBalance = "$44,976.00";

    const copyAddress = () => {
        navigator.clipboard.writeText("0x742d35Cc6634C0532925a3b844Bc9e7595f9aB8");
        toast.success("Address copied to clipboard");
    };

    return (
        <div className="min-h-screen pt-24 pb-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Tab Navigation */}
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8 bg-[#121212] border border-[#1E1E1E]">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="swap">Swap</TabsTrigger>
                        <TabsTrigger value="send">Send</TabsTrigger>
                        <TabsTrigger value="trends">TrendView</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-8">
                        {/* Wallet Address Card */}
                        <Card className="p-6 bg-[#121212] border-[#1E1E1E]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[#A0A0A0] mb-1">Wallet Address</p>
                                    <div className="flex items-center gap-2">
                                        <code className="text-white font-mono">0x742d35Cc6634C0532925a3b844Bc9e7595f9aB8</code>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        aria-label="Copy wallet address"
                                        variant="ghost"
                                        size="sm"
                                        onClick={copyAddress}
                                        className="text-[#A0A0A0] hover:text-[#26D578]"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-[#A0A0A0] hover:text-[#26D578]"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Portfolio Overview */}
                        <Card className="p-8 bg-gradient-to-br from-[#121212] to-[#0A0A0A] border-[#1E1E1E]">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <p className="text-sm text-[#A0A0A0] mb-2">Total Portfolio Value</p>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-5xl font-bold">
                                            {balanceVisible ? totalBalance : "••••••"}
                                        </h2>
                                        <button
                                            onClick={() => setBalanceVisible(!balanceVisible)}
                                            className="text-[#A0A0A0] hover:text-white transition-colors"
                                            aria-label={balanceVisible ? "Hide balance" : "Show balance"} aria-pressed={balanceVisible}
                                        >
                                            {balanceVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="text-sm text-[#26D578] mt-2">+$2,345.50 (+5.5%) today</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Button
                                    onClick={() => setActiveTab("swap")}
                                    className="bg-[#26D578] hover:bg-[#26D578]/90 text-black"
                                >
                                    <ArrowUpRight className="w-4 h-4 mr-2" />
                                    Swap
                                </Button>
                                <Button
                                    onClick={() => setActiveTab("send")}
                                    variant="outline"
                                    className="border-[#1E1E1E] bg-[#0A0A0A] hover:bg-[#1E1E1E]"
                                >
                                    <ArrowDownLeft className="w-4 h-4 mr-2" />
                                    Send
                                </Button>
                                <Button
                                    onClick={() => setActiveTab("trends")}
                                    variant="outline"
                                    className="border-[#1E1E1E] bg-[#0A0A0A] hover:bg-[#1E1E1E]"
                                >
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    TrendView
                                </Button>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Token List */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold">Assets</h3>
                                    <Button variant="ghost" size="sm" className="text-[#A0A0A0]">
                                        View All
                                    </Button>
                                </div>

                                {tokens.map((token) => (
                                    <Card
                                        key={token.symbol}
                                        className="p-4 bg-[#121212] border-[#1E1E1E] hover:border-[#26D578]/50 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Image
                                                    src={token.icon}
                                                    alt={token.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div>
                                                    <p className="font-semibold">{token.symbol}</p>
                                                    <p className="text-sm text-[#A0A0A0]">{token.name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{token.amount}</p>
                                                <p className="text-sm text-[#A0A0A0]">{token.usdValue}</p>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`text-sm font-semibold ${token.changePositive ? "text-[#26D578]" : "text-red-500"
                                                        }`}
                                                >
                                                    {token.change}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Recent Transactions */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>

                                {transactions.map((tx, index) => (
                                    <Card key={index} className="p-4 bg-[#121212] border-[#1E1E1E]">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "send"
                                                    ? "bg-red-500/10"
                                                    : tx.type === "receive"
                                                        ? "bg-[#26D578]/10"
                                                        : "bg-[#D4AF37]/10"
                                                    }`}
                                            >
                                                {tx.type === "send" ? (
                                                    <ArrowUpRight className="w-5 h-5 text-red-500" />
                                                ) : tx.type === "receive" ? (
                                                    <ArrowDownLeft className="w-5 h-5 text-[#26D578]" />
                                                ) : (
                                                    <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold capitalize">{tx.type}</p>
                                                    <p className="font-semibold">{tx.amount}</p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-[#A0A0A0] truncate">
                                                        {tx.type === "send" ? `To ${tx.to}` : tx.type === "receive" ? `From ${tx.from}` : tx.token}
                                                    </p>
                                                    <p className="text-sm text-[#A0A0A0]">{tx.usdValue}</p>
                                                </div>
                                                <p className="text-xs text-[#A0A0A0] mt-1">{tx.time}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                <AdSlot adId="wallet-sidebar-ad" className="mt-8">
                                    <BannerAd
                                        imageURL="/ads.mp4"
                                        linkURL="https://example.com"
                                        size={BannerAdSize.MEDIUM_RECTANGLE}
                                        altText="Video Ad"
                                        mediaType="video"
                                    />
                                </AdSlot>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Swap Tab */}
                    <TabsContent value="swap">
                        <SwapPage />
                    </TabsContent>

                    {/* Send Tab */}
                    <TabsContent value="send">
                        <SendPage />
                    </TabsContent>

                    {/* TrendView Tab */}
                    <TabsContent value="trends">
                        <TrendViewPage />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}