"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Label } from "../ui";
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
import { useAuthStore } from "@/store";

export function WalletDashboard() {
  const router = useRouter();
  const { identity } = useAuthStore();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const walletAddress = identity || "0x0000...0000";

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
      description: "Instantly convert assets with real-time price routing.",
      icon: ArrowUpRight,
      href: "/app/swap",
      primary: true,
    },
    {
      title: "Send",
      description: "Transfer funds securely to external wallet addresses.",
      icon: ArrowDownLeft,
      href: "/app/send",
      primary: false,
    },
    {
      title: "Trends",
      description: "Analyze market movements and asset performance.",
      icon: TrendingUp,
      href: "/app/trends",
      primary: false,
    },
    {
      title: "Escrow",
      description: "Enable buyer protection for high-value transactions.",
      icon: ShieldCheck,
      href: "/app/escrow",
      primary: false,
    },
  ] as const;

  const totalBalance = "$44,976.00";

  const copyAddress = () => {
    if (identity) {
      navigator.clipboard.writeText(identity);
      toast.success("Address copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen px-4 pt-20 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
        {/* Wallet Identity Card */}
        <Card className="border-border bg-card p-4 md:p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <Label className="mb-2 ml-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Wallet Address
              </Label>
              <div className="group relative flex items-center rounded-xl border border-border bg-background/50 px-4 py-3">
                <code className="block flex-1 overflow-hidden text-ellipsis break-all font-mono text-sm text-foreground sm:text-base">
                  {walletAddress}
                </code>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-start sm:self-center mt-5">
              <Button
                aria-label="Copy wallet address"
                variant="outline"
                size="icon"
                onClick={copyAddress}
                className="h-10 w-10 rounded-xl border-border bg-background hover:text-primary transition-all cursor-pointer"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl border-border bg-background hover:text-primary transition-all cursor-pointer"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Portfolio Overview */}
        <Card className="border-border bg-linear-to-br from-card via-card to-background/50 p-6 md:p-10 shadow-lg">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Portfolio Value
              </Label>
              <div className="flex items-center gap-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                  {balanceVisible ? totalBalance : "••••••••"}
                </h2>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="rounded-full p-2 cursor-pointer text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                  aria-label={balanceVisible ? "Hide balance" : "Show balance"}
                >
                  {balanceVisible ? <Eye className="h-6 w-6" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <TrendingUp className="h-4 w-4" />
                +$2,345.50 (5.5%) <span className="text-muted-foreground">last 24h</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {routeActions.map((action) => (
              <div key={action.title} className="flex flex-col gap-2">
                <Button
                  onClick={() => router.push(action.href)}
                  variant={action.primary ? "default" : "outline"}
                  className={`h-14 w-full justify-start cursor-pointer rounded-xl px-4 text-base font-bold transition-all active:scale-95 ${
                    action.primary
                      ? "bg-primary text-black hover:bg-primary/90"
                      : "border-border bg-background/50 hover:bg-background"
                  }`}
                >
                  <action.icon
                    className={`mr-3 h-5 w-5 ${action.primary ? "text-black" : "text-primary"}`}
                  />
                  {action.title}
                </Button>
                <p className="hidden md:block px-1 text-xs leading-relaxed text-muted-foreground/80">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Asset List */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold tracking-tight">Your Assets</h3>
              <Button variant="link" size="sm" className="font-semibold text-primary">
                View All
              </Button>
            </div>

            <div className="grid gap-3">
              {tokens.map((token) => (
                <Card
                  key={token.symbol}
                  className="group cursor-pointer border-border bg-card p-4 transition-all hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-background">
                        <Image src={token.icon} alt={token.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold leading-none">{token.symbol}</p>
                        <p className="mt-1 text-xs text-muted-foreground font-medium uppercase">
                          {token.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{token.amount}</p>
                      <p className="text-xs text-muted-foreground font-medium">{token.usdValue}</p>
                    </div>
                    <div className="hidden sm:block text-right min-w-20">
                      <p
                        className={`text-sm font-bold ${token.changePositive ? "text-primary" : "text-red-500"}`}
                      >
                        {token.change}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-tight px-1">Recent Activity</h3>

            <div className="grid gap-3">
              {transactions.map((tx, index) => (
                <Card key={index} className="border-border bg-card/50 p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        tx.type === "send"
                          ? "bg-red-500/10"
                          : tx.type === "receive"
                            ? "bg-primary/10"
                            : "bg-amber-500/10"
                      }`}
                    >
                      {tx.type === "send" ? (
                        <ArrowUpRight className="h-5 w-5 text-red-500" />
                      ) : tx.type === "receive" ? (
                        <ArrowDownLeft className="h-5 w-5 text-primary" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold capitalize leading-none text-sm">{tx.type}</p>
                        <p className="text-sm font-bold">{tx.amount}</p>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-muted-foreground font-medium">
                          {tx.type === "send"
                            ? `To ${tx.to}`
                            : tx.type === "receive"
                              ? `From ${tx.from}`
                              : tx.token}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">{tx.usdValue}</p>
                      </div>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        {tx.time}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <AdSlot
              adId="wallet-sidebar-ad"
              className="mt-6 rounded-2xl overflow-hidden border border-border"
            >
              <BannerAd
                imageURL="/ads.mp4"
                linkURL="https://example.com"
                size={BannerAdSize.MEDIUM_RECTANGLE}
                altText="Featured"
                mediaType="video"
              />
            </AdSlot>
          </div>
        </div>
      </div>
    </div>
  );
}
