"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  LockKeyhole,
  Repeat,
  Scale,
  Send,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { HOME_SECTION_IDS, HOME_SECTION_RAIL_LINKS } from "@/constants/homeSections";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onConnect: () => void;
}

interface FeatureCard {
  title: string;
  description: string;
  reason: string;
  icon: typeof Wallet;
}

interface DetailRow {
  label: string;
  value: string;
}

const heroProofPoints = ["Fixed-fee review", "Escrow when needed", "Built for merchants and users"];

const problemPoints = [
  "Many Muslims still navigate digital payments with unclear charges or structures that weaken trust.",
  "Merchants need a payment flow that feels modern without abandoning ethical standards.",
  "Sensitive transactions sometimes need more than a receipt. They need visible protection.",
];

const responsePoints = [
  "Show the amount, fee, and destination before approval.",
  "Support direct payments, transfers, and protected escrow flows in one product.",
  "Keep the product story honest about what is live and what is still being built.",
];

const heroNodes = [
  { x: 8, y: 14, delay: 0 },
  { x: 18, y: 38, delay: 0.45 },
  { x: 26, y: 72, delay: 0.9 },
  { x: 34, y: 21, delay: 1.35 },
  { x: 42, y: 56, delay: 1.8 },
  { x: 48, y: 84, delay: 2.25 },
  { x: 56, y: 30, delay: 2.7 },
  { x: 62, y: 65, delay: 3.15 },
  { x: 70, y: 18, delay: 3.6 },
  { x: 76, y: 52, delay: 4.05 },
  { x: 84, y: 74, delay: 4.5 },
  { x: 90, y: 28, delay: 4.95 },
  { x: 14, y: 88, delay: 5.4 },
  { x: 58, y: 9, delay: 5.85 },
  { x: 94, y: 58, delay: 6.3 },
];

const platformPillars: FeatureCard[] = [
  {
    title: "Online Payments",
    description: "Review the amount, fee, and destination before a purchase is approved.",
    reason: "Buyers and merchants see the same transaction terms from the start.",
    icon: Wallet,
  },
  {
    title: "Transfers",
    description: "Send value to people, teams, or businesses with a cleaner payout flow.",
    reason: "It supports everyday movement of money, not just crypto-native actions.",
    icon: Send,
  },
  {
    title: "Escrow Protection",
    description: "Hold funds until terms are met, then release or refund with visible state changes.",
    reason: "Trust becomes part of the payment flow instead of an afterthought.",
    icon: ShieldCheck,
  },
];

const paymentReviewRows: DetailRow[] = [
  { label: "Merchant", value: "Noor Market" },
  { label: "Order amount", value: "1,250 SDA" },
  { label: "Fixed platform fee", value: "25 SDA" },
  { label: "Network fee", value: "0.40 SDA" },
  { label: "Total before approval", value: "1,275.40 SDA" },
];

const transferDetails: DetailRow[] = [
  { label: "Recipient", value: "Amina Textiles" },
  { label: "Purpose", value: "Supplier settlement" },
  { label: "Transfer amount", value: "480 SDA" },
  { label: "Fee handling", value: "Fixed before approval" },
];

const escrowStates = [
  {
    title: "Locked",
    copy: "Funds can stay held while both sides review the terms of the transaction.",
    icon: LockKeyhole,
  },
  {
    title: "Released",
    copy: "The agreed amount moves when the transaction condition is met.",
    icon: CheckCircle2,
  },
  {
    title: "Refunded",
    copy: "If the transaction should not continue, value can return cleanly.",
    icon: Repeat,
  },
  {
    title: "Visible State",
    copy: "Both sides can see whether the transaction is pending, locked, released, or refunded.",
    icon: Eye,
  },
];

const principles = [
  {
    title: "Fixed transparent fees",
    copy: "Charges should be visible before approval, not discovered after money moves.",
  },
  {
    title: "Ethical transaction design",
    copy: "The product is framed around fair dealing, clear terms, and responsible digital commerce.",
  },
  {
    title: "User control",
    copy: "Approval stays with the user. Transactions should never feel hidden or abstracted away.",
  },
  {
    title: "Governance path",
    copy: "Shariah review, oversight, and compliance still matter as the platform matures.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Connect",
    copy: "Start the flow with a wallet connection so payments and approvals stay tied to the user.",
  },
  {
    step: "02",
    title: "Review",
    copy: "See the amount, fee, destination, and whether the transaction should settle directly or use escrow.",
  },
  {
    step: "03",
    title: "Pay or secure",
    copy: "Approve a direct payment or hold funds in escrow until the transaction can be released or refunded.",
  },
];

const visibilityRows: DetailRow[] = [
  { label: "Payment amount", value: "Shown before approval" },
  { label: "Fees", value: "Visible before funds move" },
  { label: "Recipient or counterparty", value: "Always reviewable" },
  { label: "Settlement mode", value: "Direct payment or escrow" },
  { label: "Escrow state", value: "Pending, locked, released, or refunded" },
];

const sectionReveal = (reducedMotion: boolean, delay = 0) => ({
  initial: { opacity: 0, y: reducedMotion ? 8 : 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: {
    duration: reducedMotion ? 0.2 : 0.45,
    delay,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
});

function NeuralNode({ delay = 0, x = 0, y = 0 }: { delay?: number; x?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.18, 0.5, 0.18] }}
      transition={{ duration: 4.6, repeat: Infinity, delay }}
      className="absolute h-1.5 w-1.5 rounded-full bg-primary/30 blur-[1px]"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90">
      {children}
    </span>
  );
}

export function LandingPage({ onConnect }: LandingPageProps) {
  const reducedMotion = useReducedMotion() ?? false;

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-foreground">
      <section
        id={HOME_SECTION_IDS.hero}
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 noise-overlay"
      >
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute left-[-5%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px] animate-organic-float" />
          <div
            className="absolute bottom-[10%] right-[-5%] h-[35%] w-[35%] rounded-full bg-(--byreix-gold)/10 blur-[100px] animate-organic-float"
            style={{ animationDelay: "-5s" }}
          />

          {heroNodes.map((node, index) => (
            <NeuralNode key={index} x={node.x} y={node.y} delay={node.delay} />
          ))}

          <svg className="absolute inset-0 h-full w-full opacity-20">
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 10,20 Q 50,50 90,80"
              stroke="url(#line-grad)"
              strokeWidth="0.5"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M 80,10 Q 40,60 20,90"
              stroke="url(#line-grad)"
              strokeWidth="0.5"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
            />
          </svg>
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute inset-x-0 top-0 z-10 h-1/2 bg-linear-to-b from-background via-background/55 to-transparent" />

          <motion.div
            initial={{ opacity: 0, scale: 1.05, y: 160 }}
            animate={{ opacity: 1, scale: 1, y: 130 }}
            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex h-full w-full flex-col justify-end"
          >
            <div className="relative w-full aspect-21/9 opacity-95">
              <Image
                src="/horizon_glow.png"
                alt=""
                fill
                className="object-cover mix-blend-screen"
                style={{
                  maskImage: "linear-gradient(to bottom, transparent, black 15%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%)",
                }}
              />
            </div>
          </motion.div>
        </div>

        <div className="relative z-20 mx-auto w-full max-w-6xl pt-12 sm:pt-16 lg:pt-20">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/3 px-4 py-1.5 backdrop-blur-xl">
                <span className="rounded-sm bg-primary px-1.5 py-0.5 text-[9px] font-black text-primary-foreground">
                  BYREIXWIFT
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary/90">
                  Online payments on Sidrachain
                </span>
              </div>

              <h1 className="mb-5 flex max-w-5xl flex-col items-center">
                <span className="mb-3 text-3xl font-medium tracking-tight text-foreground/92 sm:text-5xl lg:text-6xl">
                  Clearer payments
                </span>
                <span className="bg-linear-to-b from-white via-white to-white/60 bg-clip-text text-4xl font-black leading-[0.84] tracking-[-0.055em] text-transparent sm:text-7xl lg:text-[7.75rem] xl:text-[8.75rem]">
                  FOR USERS
                  <span className="bg-linear-to-b from-(--byreix-gold) to-(--byreix-gold-soft) bg-clip-text text-transparent">
                    {" "}
                    AND MERCHANTS
                  </span>
                </span>
              </h1>

              <p className="mb-8 max-w-3xl px-2 text-balance text-base leading-relaxed text-foreground/80 sm:text-xl">
                ByReiXwift helps people pay online, send funds, and use escrow when a transaction
                needs protection. Fees stay visible before approval so both sides can review the
                same terms before money moves.
              </p>

              <div className="relative p-2">
                <div className="pointer-events-none absolute inset-x-0 top-1/2 h-24 -translate-y-1/2 rounded-full bg-background/40 blur-3xl opacity-60" />

                <div className="relative z-10 mx-auto flex w-full max-w-[320px] flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
                  <Button
                    onClick={onConnect}
                    className="h-12 w-full rounded-xl border border-white/10 bg-linear-to-b from-primary via-primary to-primary/95 px-8 text-base font-bold text-primary-foreground shadow-[0_8px_30px_rgb(37,201,133,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_45px_rgb(37,201,133,0.5)] sm:h-13 sm:w-auto"
                  >
                    Launch App
                  </Button>
                  <Button
                    onClick={() => scrollToSection(HOME_SECTION_IDS.howItWorks)}
                    variant="outline"
                    className="h-12 w-full rounded-xl border-white/10 bg-transparent px-8 text-base font-semibold text-foreground/82 transition-all duration-300 hover:border-white/25 hover:bg-white/5 hover:text-foreground sm:h-13 sm:w-auto"
                  >
                    See How It Works
                  </Button>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {heroProofPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-full border border-border bg-card/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/65 bg-[linear-gradient(180deg,rgba(7,19,13,0.92)_0%,rgba(5,15,10,0.84)_100%)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--byreix-gold-soft)">
              Explore ByReiXwift
            </p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Start with the problem, move through the platform, then review the principles
              guiding the product.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {HOME_SECTION_RAIL_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="group inline-flex items-center rounded-full border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-semibold text-foreground/80 transition-all duration-300 hover:border-primary/25 hover:bg-primary/8 hover:text-foreground"
              >
                <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-(--byreix-gold-soft) transition-colors duration-300 group-hover:text-(--byreix-gold-soft)">
                  Jump
                </span>
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id={HOME_SECTION_IDS.why} className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <motion.div {...sectionReveal(reducedMotion)} className="max-w-xl">
            <SectionLabel>Why ByReiXwift Exists</SectionLabel>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Digital payments are easy to start and hard to review.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Too often, users face unclear fees, vague settlement terms, or trust gaps that only
              become obvious after a transaction begins. ByReiXwift is being built to make the
              payment flow easier to understand before approval.
            </p>
          </motion.div>

          <motion.div {...sectionReveal(reducedMotion, 0.08)} className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-border bg-card/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/85">
                What users still face
              </p>
              <div className="mt-5 space-y-4">
                {problemPoints.map((point) => (
                  <div key={point} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-border bg-linear-to-br from-card via-card to-background/60 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--byreix-gold-soft)">
                What ByReiXwift changes
              </p>
              <div className="mt-5 space-y-4">
                {responsePoints.map((point) => (
                  <div key={point} className="flex gap-3">
                    <Scale className="mt-0.5 h-4 w-4 shrink-0 text-(--byreix-gold-soft)" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section id={HOME_SECTION_IDS.overview} className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div {...sectionReveal(reducedMotion)} className="max-w-3xl">
            <SectionLabel>What ByReiXwift Is</SectionLabel>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              One platform for payments, transfers, and escrow-backed protection.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              ByReiXwift brings three core flows into one product: online payments, direct
              transfers, and escrow when a transaction needs more structure than a direct payment
              can provide.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {platformPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.article
                  key={pillar.title}
                  {...sectionReveal(reducedMotion, 0.04 * index)}
                  className="rounded-[2rem] border border-border bg-card/75 p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-foreground">{pillar.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                  <p className="mt-5 border-t border-border pt-5 text-sm leading-relaxed text-foreground/82">
                    {pillar.reason}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <motion.div
            {...sectionReveal(reducedMotion, 0.12)}
            className="mt-6 rounded-[2rem] border border-border bg-background/55 px-5 py-4"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Supporting capability:</span> swap
              support may complement payment flows where conversion matters, but it is not the
              public identity of ByReiXwift.
            </p>
          </motion.div>
        </div>
      </section>

      <section id={HOME_SECTION_IDS.payments} className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <motion.div {...sectionReveal(reducedMotion)} className="max-w-xl">
            <SectionLabel>Payment Transparency</SectionLabel>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              See the payment before you approve it.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Amount, fee, destination, and settlement mode stay visible before money moves. That
              gives users and merchants a clearer review step instead of a last-second confirmation
              screen.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Payment totals stay visible before confirmation.",
                "Fixed platform fees are part of the review.",
                "Escrow can be added when the transaction needs protection.",
              ].map((point) => (
                <div key={point} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...sectionReveal(reducedMotion, 0.08)} className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-linear-to-br from-primary/8 via-transparent to-(--byreix-gold)/8 blur-3xl" />
            <div className="relative rounded-[2rem] border border-border bg-card/88 p-6 shadow-[0_22px_55px_rgba(3,13,8,0.28)]">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Illustrative payment review
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">Checkout summary</p>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Review first
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-border bg-background/45 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Purchase purpose
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">Merchant payment</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card/75 px-3 py-2 text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Settlement mode
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">Direct or escrow</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {paymentReviewRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4">
                      <span className="text-sm text-muted-foreground">{row.label}</span>
                      <span className="text-sm font-semibold text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Fee visibility", value: "Before approval" },
                  { label: "Counterparty", value: "Shown clearly" },
                  { label: "Optional conversion", value: "Supporting utility" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border bg-background/38 p-4"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section id={HOME_SECTION_IDS.transfers} className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <motion.div {...sectionReveal(reducedMotion, 0.04)} className="order-2 lg:order-1">
            <div className="rounded-[2rem] border border-border bg-card/85 p-6 shadow-[0_18px_46px_rgba(0,0,0,0.22)]">
              <div className="flex flex-wrap gap-2 border-b border-border pb-4">
                {["Family support", "Merchant payout", "Invoice settlement"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background/45 px-3 py-1 text-xs font-semibold text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-border bg-background/45 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Transfer review
                </p>
                <div className="mt-5 space-y-3">
                  {transferDetails.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4">
                      <span className="text-sm text-muted-foreground">{row.label}</span>
                      <span className="text-sm font-semibold text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Status", value: "Visible to both sides" },
                  { label: "Confirmation", value: "Review before send" },
                  { label: "Trust layer", value: "Escrow when needed" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border bg-background/38 p-4 text-center"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div {...sectionReveal(reducedMotion)} className="order-1 max-w-xl lg:order-2">
            <SectionLabel>Transfers</SectionLabel>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Send with context, not guesswork.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Transfers should make the recipient, purpose, fee, and confirmation state easy to
              review. The goal is a cleaner payment experience, not a raw token form.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Useful for person-to-person and merchant-side transfers.",
                "Clear recipient review helps reduce mistakes.",
                "Escrow can be added when a transfer needs structure.",
              ].map((point) => (
                <div key={point} className="flex gap-3">
                  <Send className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id={HOME_SECTION_IDS.escrow} className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <motion.div {...sectionReveal(reducedMotion)} className="max-w-xl">
            <SectionLabel>Escrow as Trust Layer</SectionLabel>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Use escrow when trust needs structure.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Some transactions need more than a payment confirmation. ByReiXwift adds a visible
              protection layer so funds can be held, released, or refunded with a state both sides
              can understand.
            </p>
            <div className="mt-8 rounded-[2rem] border border-border bg-card/72 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/85">
                When it helps most
              </p>
              <div className="mt-5 space-y-4">
                {[
                  "Merchant transactions where both sides need a clearer handoff.",
                  "Business transfers that require a visible release step.",
                  "Higher-trust exchanges where payment confirmation alone is not enough.",
                ].map((point) => (
                  <div key={point} className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div {...sectionReveal(reducedMotion, 0.08)} className="grid gap-5 sm:grid-cols-2">
            {escrowStates.map((state) => {
              const Icon = state.icon;
              return (
                <article
                  key={state.title}
                  className="rounded-[2rem] border border-border bg-card/78 p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-foreground">{state.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{state.copy}</p>
                </article>
              );
            })}
          </motion.div>
        </div>
      </section>
      <section id={HOME_SECTION_IDS.principles} className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
          <motion.div {...sectionReveal(reducedMotion)} className="max-w-xl">
            <SectionLabel>Principles</SectionLabel>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              The product has to earn its language.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              ByReiXwift should reflect its principles in product behavior: clear fees, visible
              review, understandable transaction states, and a governance path that stays honest
              about what is live and what is still in progress.
            </p>
          </motion.div>

          <motion.div
            {...sectionReveal(reducedMotion, 0.08)}
            className="space-y-3 rounded-[2rem] border border-border bg-card/72 p-4 sm:p-5"
          >
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="flex flex-col gap-2 rounded-[1.5rem] border border-border bg-background/32 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
              >
                <div className="sm:max-w-[240px]">
                  <p className="text-sm font-semibold text-foreground">{principle.title}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground sm:max-w-[360px] sm:text-right">
                  {principle.copy}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id={HOME_SECTION_IDS.howItWorks} className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <motion.div {...sectionReveal(reducedMotion)}>
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              A payment flow that stays readable.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              The goal is not to add more screens. It is to give users enough context before they
              approve a payment, transfer, or protected transaction.
            </p>

            <div className="mt-10 space-y-8">
              {workflowSteps.map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="text-3xl font-black tracking-tight text-primary/30">{item.step}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...sectionReveal(reducedMotion, 0.08)}
            className="rounded-[2rem] border border-border bg-card/82 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  What stays visible
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">Before approval</p>
              </div>
              <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Review layer
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {visibilityRows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 rounded-[1.25rem] border border-border bg-background/35 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-semibold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <motion.div {...sectionReveal(reducedMotion)} className="mx-auto max-w-4xl text-center">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-12 sm:p-16">
            <div className="absolute inset-0 bg-linear-to-b from-primary/8 via-transparent to-transparent" />

            <div className="relative z-10">
              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Start with clear terms.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                ByReiXwift is being built for users and merchants who want online payments with
                visible fees, clearer approval, and escrow-backed protection when a transaction
                needs more trust.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  onClick={onConnect}
                  size="lg"
                  className="h-12 rounded-lg bg-primary px-7 text-base font-semibold text-background transition-colors duration-200 hover:bg-primary/90"
                >
                  Launch App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => scrollToSection(HOME_SECTION_IDS.principles)}
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-lg border-white/10 bg-transparent px-7 text-base font-semibold text-foreground/84 hover:border-white/25 hover:bg-white/5 hover:text-foreground"
                >
                  Read the Principles
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
