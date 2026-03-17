"use client";

import { Button } from "../ui";
import { ArrowRight, Repeat, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onConnect: () => void;
}

export function LandingPage({ onNavigate, onConnect }: LandingPageProps) {
  const easeOutQuint: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const reducedMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reducedMotion ? 0.18 : 0.38, delay, ease: easeOutQuint },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}

      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background - Earth-like glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 100%, rgba(42,212,138,0.14) 0%, rgba(19,138,88,0.06) 42%, transparent 78%), radial-gradient(38% 34% at 50% 0%, rgba(214,196,133,0.08) 0%, transparent 72%), radial-gradient(30% 40% at 100% 35%, rgba(42,212,138,0.06) 0%, transparent 74%)",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative w-full">
          <div className="max-w-3xl mx-auto text-center">
            {/* Left: Text Content - Bolder Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease: easeOutQuint }}
            >
              {/* Headline - Direct and minimal */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[0.92] tracking-[-0.03em]">
                <span className="text-foreground">Your Wallet,</span>
                <br />
                <span className="bg-linear-to-r from-(--byreix-gold-soft) to-(--byreix-gold) bg-clip-text text-transparent">
                  Your Terms.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                The non-custodial wallet for Sidrachain. Swap, send, and track with zero compromise.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={onConnect}
                  size="lg"
                  className="h-12 px-6 bg-primary hover:bg-primary/90 text-background font-semibold text-base rounded-lg transition-colors duration-200"
                >
                  Connect Wallet
                </Button>
                <button
                  onClick={() => onNavigate("wallet")}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Open app
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dedicated Feature Chapters - Breaking the container */}
      <section className="relative overflow-hidden">
        {/* 1. Swap Chapter - Deep Material Focus */}
        <div className="py-24 px-4 sm:px-6 lg:px-8 border-b border-border relative group">
          <div className="absolute inset-0 bg-linear-to-b from-primary/4 to-transparent opacity-70" />
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-14 items-center">
            <motion.div {...reveal(0.02)}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <Repeat className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
                  Liquidity Engine
                </span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tighter text-foreground">
                Swap <br />
                <span className="text-primary">Routing Desk</span>
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-md">
                Route orders across available pools and surface effective price, fees, and slippage
                before you sign.
              </p>
              <div className="mt-8 p-5 rounded-3xl bg-card/70 border border-border inline-block">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      Avg. Slippage
                    </p>
                    <p className="text-xl font-bold text-foreground">0.08%</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      Routed Pools
                    </p>
                    <p className="text-xl font-bold text-primary">12+</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div {...reveal(0.08)} className="relative">
              <div className="relative max-w-xl mx-auto">
                <div className="rounded-2xl border border-border bg-card/90 p-5 sm:p-6">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Swap Quote
                    </p>
                    <p className="text-xs font-medium text-primary">Indicative</p>
                  </div>

                  <div className="py-5 space-y-4">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="text-2xl font-semibold text-foreground leading-none mt-1">
                          12,500{" "}
                          <span className="text-base font-medium text-muted-foreground">SDA</span>
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">To</p>
                        <p className="text-2xl font-semibold text-primary leading-none mt-1">
                          5,247.22{" "}
                          <span className="text-base font-medium text-muted-foreground">USDC</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-3">
                    {[
                      { k: "Effective Price", v: "1 SDA = 0.4198" },
                      { k: "Network Fee", v: "$0.18" },
                      { k: "Routing Path", v: "Pool A > Pool C" },
                    ].map((item) => (
                      <div key={item.k} className="flex items-center justify-between gap-4">
                        <span className="text-xs text-muted-foreground">{item.k}</span>
                        <span className="text-sm font-medium text-foreground">{item.v}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground mt-5">
                    Quote refreshes automatically before confirmation.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 2. Send Chapter - Minimalist Velocity */}
        <div className="py-24 px-4 sm:px-6 lg:px-8 border-b border-border bg-transparent">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-14 items-center">
            <motion.div {...reveal(0.03)} className="lg:order-2">
              <h2 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tighter text-foreground">
                Global <br />
                <span className="text-primary">Transfer Flow</span>
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-md">
                Send value with full transparency: fee quote, ETA, and recipient verification in one
                flow.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground tracking-widest uppercase">
                  Verified Address Dispatch
                </span>
              </div>
            </motion.div>
            <motion.div {...reveal(0.09)} className="lg:order-1 flex justify-center">
              <div className="w-full max-w-lg rounded-3xl border border-border bg-card/85 p-5 sm:p-6 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-(--byreix-gold)/7 via-transparent to-primary/7" />
                <div className="absolute right-4 top-4 w-20 h-20 rounded-3xl border border-border/60 rotate-12" />
                <div className="relative space-y-4">
                  <div className="rounded-2xl border border-border bg-background/55 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Recipient
                    </p>
                    <p className="text-sm text-foreground font-medium mt-1">0x742d...9aB8</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/55 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Amount
                      </p>
                      <p className="text-xs text-muted-foreground">SDA</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground mt-1">2,400.00</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { k: "Network Fee", v: "$0.11" },
                      { k: "ETA", v: "28s" },
                      { k: "Status", v: "Verified" },
                    ].map((item) => (
                      <div
                        key={item.k}
                        className="rounded-xl border border-border bg-background/40 p-3 text-center"
                      >
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                          {item.k}
                        </p>
                        <p className="text-xs font-semibold text-foreground mt-1">{item.v}</p>
                      </div>
                    ))}
                  </div>

                  <div className="h-14 rounded-2xl bg-primary text-background font-bold flex items-center justify-center">
                    Review and Broadcast
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 3. Escrow Chapter - The Trustless Standard */}
        <div className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
            <motion.div {...reveal(0.04)} className="max-w-4xl">
              <span className="text-primary font-mono text-sm tracking-[0.5em] uppercase mb-8 block">
                Escrow Controls
              </span>
              <h2 className="text-4xl sm:text-6xl font-bold mb-8 tracking-tighter text-foreground">
                Escrow Operations
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed mb-12">
                Contract-backed settlement with milestone release, dispute windows, and auditable
                state transitions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                {[
                  { label: "Value Locked", val: "$1.2B+" },
                  { label: "Dispute SLA", val: "< 24h" },
                  { label: "Escrow Uptime", val: "99.99%" },
                ].map((item, idx) => (
                  <div
                    key={item.label}
                    className={`p-6 rounded-4xl bg-card border border-border ${idx === 0 ? "sm:col-span-6 text-left" : "sm:col-span-3 text-center"}`}
                  >
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground tracking-tight">{item.val}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Process Section - "Moment-based" Navigation */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-14 items-center">
            <motion.div {...reveal(0.02)}>
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 tracking-tighter leading-none">
                One surface. <br />
                Full context. <br />
                <span className="text-primary">Minimal noise.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-lg font-light leading-relaxed">
                See fees, routes, confirmations, and activity history in one place before you
                approve any transaction.
              </p>

              <div className="space-y-9">
                {[
                  {
                    step: "01",
                    title: "Authenticate",
                    desc: "Connect your wallet or social identity with self-custody retained.",
                  },
                  {
                    step: "02",
                    title: "Simulate",
                    desc: "Inspect fee, route, settlement ETA, and fallback state before signing.",
                  },
                  {
                    step: "03",
                    title: "Settle",
                    desc: "Broadcast once. Track confirmation and receipts in real time.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-8 group">
                    <div className="text-3xl font-mono text-primary/20 group-hover:text-primary/60 transition-colors duration-500">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-muted-foreground leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Minimal Benchmark Panel */}
            <motion.div
              {...reveal(0.08)}
              className="w-full rounded-3xl border border-border bg-card/80"
            >
              <div className="px-6 sm:px-8 py-5 border-b border-border flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Operational Principles
                </p>
                <p className="text-xs font-medium text-primary">Always visible</p>
              </div>
              <div className="px-6 sm:px-8 py-3">
                {[
                  {
                    label: "Execution",
                    value: "Quotes and route checks appear before you approve.",
                  },
                  { label: "Fees", value: "No hidden charges between quote and confirmation." },
                  { label: "Custody", value: "Keys remain with you through the full flow." },
                  {
                    label: "Escrow",
                    value: "Dispute and release states stay transparent end to end.",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="py-4 border-b border-border last:border-b-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4"
                  >
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-foreground sm:text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Clean & Focused */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div {...reveal(0.03)} className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 sm:p-16 rounded-[2.5rem] bg-card border border-border overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-linear-to-b from-primary/8 via-transparent to-transparent" />

            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight text-foreground">
                Connect once. <span className="text-primary">Manage everything in one place.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Built for users who need reliable execution, transparent fees, and direct custody on
                Sidrachain.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  onClick={onConnect}
                  size="lg"
                  className="h-12 px-7 bg-primary hover:bg-primary/90 text-background font-semibold text-base rounded-lg group transition-colors duration-200"
                >
                  Connect Wallet
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Read documentation
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
