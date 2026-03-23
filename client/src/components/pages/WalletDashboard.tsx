"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "../ui";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { AdSlot, BannerAd, BannerAdSize } from "@/components/ads";

export function WalletDashboard() {
  const router = useRouter();
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
      token: "BTC -> SDA",
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

  const routeActions = [
    {
      title: "Swap",
      description: "Open the quote flow and review token conversion details.",
      icon: ArrowUpRight,
      href: "/app/swap",
      primary: true,
    },
    {
      title: "Send",
      description: "Move funds to a wallet or business address with review before confirmation.",
      icon: ArrowDownLeft,
      href: "/app/send",
      primary: false,
    },
    {
      title: "Trends",
      description: "Check price movement and market context before taking action.",
      icon: TrendingUp,
      href: "/app/trends",
      primary: false,
    },
    {
      title: "Escrow",
      description: "Create and track protected transactions with visible state changes.",
      icon: ShieldCheck,
      href: "/app/escrow",
      primary: false,
    },
  ] as const;

  const totalBalance = "$44,976.00";

  const copyAddress = () => {
    navigator.clipboard.writeText("0x742d35Cc6634C0532925a3b844Bc9e7595f9aB8");
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-sm text-muted-foreground">Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="font-mono text-white">
                  0x742d35Cc6634C0532925a3b844Bc9e7595f9aB8
                </code>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Copy wallet address"
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="text-muted-foreground hover:text-primary"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-linear-to-br from-card to-background p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Total Portfolio Value</p>
              <div className="flex items-center gap-3">
                <h2 className="text-5xl font-bold">{balanceVisible ? totalBalance : "******"}</h2>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={balanceVisible ? "Hide balance" : "Show balance"}
                  aria-pressed={balanceVisible}
                >
                  {balanceVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 text-sm text-primary">+$2,345.50 (+5.5%) today</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {routeActions.map((action) => (
              <Button
                key={action.title}
                onClick={() => router.push(action.href)}
                variant={action.primary ? "default" : "outline"}
                className={
                  action.primary
                    ? "justify-start bg-primary text-black hover:bg-primary/90"
                    : "justify-start border-border bg-background hover:bg-border"
                }
              >
                <action.icon className="mr-2 h-4 w-4" />
                {action.title}
              </Button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-4">
            {routeActions.map((action) => (
              <div
                key={`${action.title}-detail`}
                className="rounded-2xl border border-border bg-background/45 p-4"
              >
                <p className="text-sm font-semibold text-foreground">{action.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Assets</h3>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View All
              </Button>
            </div>

            {tokens.map((token) => (
              <Card
                key={token.symbol}
                className="cursor-pointer border-border bg-card p-4 transition-all hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={token.icon}
                      alt={token.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{token.amount}</p>
                    <p className="text-sm text-muted-foreground">{token.usdValue}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        token.changePositive ? "text-primary" : "text-red-500"
                      }`}
                    >
                      {token.change}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="mb-4 text-xl font-semibold">Recent Activity</h3>

            {transactions.map((tx, index) => (
              <Card key={index} className="border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      tx.type === "send"
                        ? "bg-red-500/10"
                        : tx.type === "receive"
                          ? "bg-primary/10"
                          : "bg-accent/10"
                    }`}
                  >
                    {tx.type === "send" ? (
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                    ) : tx.type === "receive" ? (
                      <ArrowDownLeft className="h-5 w-5 text-primary" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-(--byreix-gold)" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="font-semibold capitalize">{tx.type}</p>
                      <p className="font-semibold">{tx.amount}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm text-muted-foreground">
                        {tx.type === "send"
                          ? `To ${tx.to}`
                          : tx.type === "receive"
                            ? `From ${tx.from}`
                            : tx.token}
                      </p>
                      <p className="text-sm text-muted-foreground">{tx.usdValue}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{tx.time}</p>
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
      </div>
    </div>
  );
}
