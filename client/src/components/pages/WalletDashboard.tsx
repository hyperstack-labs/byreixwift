"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  ShieldCheck,
  Clock,
  Inbox,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Label } from "@/components/ui";
import { AdSlot, BannerAd, BannerAdSize } from "@/components/ads";
import { useAuthStore } from "@/store";
import { useEscrows } from "@/hooks";

interface TokenAsset {
  symbol: string;
  name: string;
  amount: string;
  usdValue: string;
  change: string;
  changePositive: boolean;
  icon: string;
}

interface EscrowRecord {
  id: string | number;
  state: string;
  amount: string | number;
  description?: string;
  tokenSymbol?: string;
  createdAt?: string;
}

export function WalletDashboard() {
  const router = useRouter();
  const { identity } = useAuthStore();
  const [balanceVisible, setBalanceVisible] = useState<boolean>(true);

  const walletAddress = identity || "0x0000...0000";

  // Data fetching from api/escrows
  const {
    data: escrows = [],
    isLoading: isLoadingEscrows,
    error: escrowsError,
  } = useEscrows() as {
    data: EscrowRecord[];
    isLoading: boolean;
    error: Error | null;
  };

  // Dynamically calculate live active escrow total value
  const totalEscrowBalanceString = useMemo<string>(() => {
    if (!escrows || escrows.length === 0) return "0.00";

    const activeTotal = escrows
      .filter((escrow) => escrow.state?.toUpperCase() === "PENDING")
      .reduce((sum, escrow) => {
        const rawAmount = escrow.amount !== undefined && escrow.amount !== null ? escrow.amount : 0;
        const amount = typeof rawAmount === "string" ? parseFloat(rawAmount) : rawAmount;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

    return activeTotal.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [escrows]);

  // Static assets tokens
  const tokens: TokenAsset[] = [
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

  const copyAddress = (): void => {
    if (identity && identity !== "0x0000...0000") {
      navigator.clipboard
        .writeText(identity)
        .then(() => {
          toast.success("Address copied securely to clipboard", {
            description: "Ready to use for verifiable transaction executions.",
          });
        })
        .catch(() => {
          toast.error("Failed to copy address", {
            description: "System clipboard permissions may be restricted.",
          });
        });
    } else {
      toast.error("Transaction Error: Connection Missing", {
        description: "Please connect an active Web3 identification provider wallet to continue.",
      });
    }
  };

  const getStatusStyles = (state: string) => {
    switch (state?.toUpperCase()) {
      case "PENDING":
        return { text: "text-amber-500", bg: "bg-amber-500/10", label: "Pending" };
      case "RELEASED":
        return { text: "text-primary", bg: "bg-primary/10", label: "Released" };
      case "REFUNDED":
        return { text: "text-blue-500", bg: "bg-blue-500/10", label: "Refunded" };
      default:
        return { text: "text-muted-foreground", bg: "bg-muted", label: state || "Unknown" };
    }
  };

  // Helper function to cleanly format the full string date and exact time
  const formatActivityDateTime = (dateString?: string): string => {
    if (!dateString) return "Recent";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return "Recent";

    const datePart = dateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    const timePart = dateObj.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${datePart} • ${timePart}`;
  };

  return (
    <div className="min-h-screen px-4 pt-20 pb-24 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
        {/* Wallet Identity Card */}
        <Card className="border-border bg-card p-4 md:p-6 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <Label className="mb-2 ml-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Wallet Address
              </Label>
              <div className="group relative flex items-center rounded-xl border border-border bg-background/50 px-4 py-3 transition-colors hover:border-primary/30">
                <code className="block flex-1 overflow-hidden text-ellipsis break-all font-mono text-sm text-foreground sm:text-base">
                  {walletAddress}
                </code>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-start sm:self-center mt-2 sm:mt-0">
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
                aria-label="View on block explorer"
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
        <Card className="border-border bg-linear-to-br from-card via-card to-background/50 p-6 md:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-32 -mt-32 rounded-full pointer-events-none" />

          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Portfolio Value
              </Label>
              <div className="flex items-center gap-4 min-h-16">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight transition-all">
                  {balanceVisible ? (
                    isLoadingEscrows ? (
                      <span className="text-2xl font-medium text-muted-foreground inline-flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading Value...
                      </span>
                    ) : escrowsError ? (
                      <span className="text-xl font-semibold text-red-500 inline-flex items-center gap-1.5">
                        <AlertCircle className="h-5 w-5" /> Value unavailable
                      </span>
                    ) : (
                      `$${totalEscrowBalanceString}`
                    )
                  ) : (
                    "••••••••"
                  )}
                </h2>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="rounded-full p-2 cursor-pointer text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                  aria-label={balanceVisible ? "Hide balance" : "Show balance"}
                >
                  {balanceVisible ? <Eye className="h-6 w-6" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary mt-1">
                <TrendingUp className="h-4 w-4" />
                <span>+$2,345.50 (5.5%)</span>
                <span className="text-muted-foreground font-normal">last 24h</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 relative z-10">
            {routeActions.map((action) => (
              <div key={action.title} className="flex flex-col gap-2">
                <Button
                  onClick={() => router.push(action.href)}
                  variant={action.primary ? "default" : "outline"}
                  className={`h-14 w-full justify-start cursor-pointer rounded-xl px-4 text-base font-bold transition-all active:scale-95 ${
                    action.primary
                      ? "bg-primary text-black hover:bg-primary/90 border-transparent"
                      : "border-border bg-background/50 hover:bg-background text-foreground"
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
              <h3 className="text-lg font-bold tracking-tight text-foreground">Your Assets</h3>
              <Button
                variant="link"
                size="sm"
                className="font-semibold text-primary cursor-pointer p-0 h-auto hover:no-underline"
              >
                View All
              </Button>
            </div>

            {/* Static Token Asset List Layout */}
            <div className="grid gap-3">
              {tokens.map((token) => (
                <Card
                  key={token.symbol}
                  className="group cursor-pointer border-border bg-card p-4 transition-all hover:border-primary/40 active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-background shadow-xs">
                        <Image
                          src={token.icon}
                          alt={`${token.name} identity matrix graphical icon`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold leading-none group-hover:text-primary transition-colors truncate">
                          {token.symbol}
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">
                          {token.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-foreground">{token.amount}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {token.usdValue}
                      </p>
                    </div>

                    <div className="hidden sm:block text-right min-w-20 shrink-0">
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

          {/* Activity Logs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold tracking-tight text-foreground">Recent Activity</h3>
              {isLoadingEscrows && (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>

            <div className="grid gap-3">
              {/* Async Loading Animation */}
              {isLoadingEscrows &&
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="border-border bg-card/40 p-4 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-muted shrink-0" />
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="h-3.5 w-2/3 bg-muted rounded" />
                        <div className="h-2.5 w-1/3 bg-muted/60 rounded" />
                      </div>
                    </div>
                  </Card>
                ))}

              {/* Dynamic Escrow Iteration */}
              {!isLoadingEscrows && escrowsError && (
                <div className="flex flex-col items-center justify-center py-8 px-4 border border-red-500/20 rounded-2xl bg-red-500/5">
                  <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                  <p className="text-xs font-bold text-red-500 text-center mb-1">
                    Failed to sync records
                  </p>
                  <p className="text-[11px] text-muted-foreground text-center max-w-50">
                    Check your connection details or network credentials.
                  </p>
                </div>
              )}

              {/* Dynamic Ingested Active Escrows Render Target Loop */}
              {!isLoadingEscrows &&
                !escrowsError &&
                escrows.slice(0, 5).map((escrow) => {
                  const statusStyles = getStatusStyles(escrow.state);
                  return (
                    <Card
                      key={escrow.id}
                      className="border-border bg-card/50 p-4 hover:border-primary/20 transition-all cursor-pointer group"
                      onClick={() => router.push(`/app/escrow`)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold truncate text-sm capitalize text-foreground">
                              {escrow.description || `Escrow #${escrow.id}`}
                            </p>
                            <p className="text-sm font-bold whitespace-nowrap text-foreground">
                              {escrow.amount}
                              <span className="text-[10px] text-muted-foreground font-normal ml-1">
                                {escrow.tokenSymbol || "SDA"}
                              </span>
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 truncate">
                                {formatActivityDateTime(escrow.createdAt)}
                              </p>
                            </div>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${statusStyles.bg} ${statusStyles.text}`}
                            >
                              {statusStyles.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}

              {/* Empty State Component */}
              {!isLoadingEscrows && !escrowsError && escrows.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-border rounded-2xl bg-muted/20">
                  <Inbox className="w-8 h-8 text-muted-foreground/30 mb-3" />
                  <p className="text-xs font-semibold text-muted-foreground text-center">
                    No recent activity found
                  </p>
                </div>
              )}
            </div>

            {/* Media/Advertisement Banner */}
            <AdSlot
              adId="wallet-sidebar-ad"
              className="mt-6 rounded-2xl overflow-hidden border border-border"
            >
              <BannerAd
                imageURL="/ads.mp4"
                linkURL="https://example.com"
                size={BannerAdSize.MEDIUM_RECTANGLE}
                altText="Featured integration status"
                mediaType="video"
              />
            </AdSlot>
          </div>
        </div>
      </div>
    </div>
  );
}
