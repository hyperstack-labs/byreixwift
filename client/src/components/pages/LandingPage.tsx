"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useAnimationControls, useInView, useReducedMotion } from "motion/react";
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
import { HOME_SECTION_IDS } from "@/constants/homeSections";

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

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

const problemPoints = [
  "You often see fees and settlement terms too late in the flow.",
  "You should not have to trust a checkout you cannot properly review.",
  "Some transactions need a visible release step, not just a payment confirmation.",
];

const responsePoints = [
  "Put the amount, fees, recipient, and settlement mode in front of you before approval.",
  "Make transfers and merchant payments feel readable, not like raw token actions.",
  "Add escrow only when the transaction needs structure, then show its state clearly.",
];

const platformPillars: FeatureCard[] = [
  {
    title: "Online Payments",
    description: "Review the total, fees, and destination before you approve checkout.",
    reason: "You get a payment review first, not a wallet prompt dropped in too early.",
    icon: Wallet,
  },
  {
    title: "Transfers",
    description: "Send funds with a named recipient, purpose, and confirmation step.",
    reason: "Your everyday transfers feel intentional instead of opaque or overly technical.",
    icon: Send,
  },
  {
    title: "Escrow Protection",
    description: "Lock value until terms are met, then release or refund with visible states.",
    reason: "Protection becomes part of the flow instead of an off-platform promise.",
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

const escrowStates = [
  {
    title: "Locked",
    copy: "Funds stay held while both sides review the terms.",
    icon: LockKeyhole,
  },
  {
    title: "Released",
    copy: "The amount moves when the transaction condition is met.",
    icon: CheckCircle2,
  },
  {
    title: "Refunded",
    copy: "If the transaction should not continue, value returns cleanly.",
    icon: Repeat,
  },
  {
    title: "Visible State",
    copy: "Both sides can see whether it is pending, locked, released, or refunded.",
    icon: Eye,
  },
];

const principles = [
  {
    title: "Fixed transparent fees",
    copy: "You should see the charge before approval, not discover it after money moves.",
  },
  {
    title: "Ethical transaction design",
    copy: "The product should feel grounded in fair dealing, clear terms, and responsible digital commerce.",
  },
  {
    title: "User control",
    copy: "Approval stays with you. Transactions should never feel hidden or abstracted away.",
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
    copy: "Connect your wallet only when you're ready to approve.",
  },
  {
    step: "02",
    title: "Review",
    copy: "See the amount, fees, destination, and settlement mode first.",
  },
  {
    step: "03",
    title: "Approve",
    copy: "Pay directly or place funds in escrow and track the result.",
  },
];

const transferHighlights = [
  { label: "Recipient", value: "Named before send" },
  { label: "Fee", value: "Visible before approval" },
  { label: "Protection", value: "Escrow when needed" },
] as const;

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

const previewShell = (reducedMotion: boolean) => ({
  hidden: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: reducedMotion ? 0.18 : 0.42,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      when: "beforeChildren" as const,
      delayChildren: reducedMotion ? 0.02 : 0.16,
      staggerChildren: reducedMotion ? 0.03 : 0.08,
    },
  },
});

const previewContent = (reducedMotion: boolean) => ({
  hidden: {
    opacity: 1,
    y: reducedMotion ? 8 : 20,
    clipPath: reducedMotion ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
    WebkitClipPath: reducedMotion ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0%)",
    WebkitClipPath: "inset(0% 0% 0% 0%)",
    transition: {
      duration: reducedMotion ? 0.16 : 0.62,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      when: "beforeChildren" as const,
      delayChildren: reducedMotion ? 0.01 : 0.05,
      staggerChildren: reducedMotion ? 0.02 : 0.06,
    },
  },
});

const previewGroup = (reducedMotion: boolean) => ({
  hidden: {
    opacity: 1,
    y: reducedMotion ? 6 : 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reducedMotion ? 0.2 : 0.62,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      when: "beforeChildren" as const,
      staggerChildren: reducedMotion ? 0.02 : 0.04,
    },
  },
});

const previewItem = (reducedMotion: boolean) => ({
  hidden: {
    opacity: 1,
    y: reducedMotion ? 3 : 8,
    filter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: reducedMotion ? 0.18 : 0.56,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
});

const previewMaskStyle = {
  maskImage: "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center text-[0.78rem] font-bold uppercase tracking-[0.24em] text-primary/92 sm:text-[0.82rem]">
      {children}
    </span>
  );
}

const sectionWrapClass =
  "rounded-[2.1rem] bg-[linear-gradient(180deg,rgba(9,13,11,0.56)_0%,rgba(7,10,8,0.28)_100%)] sm:rounded-[2.75rem]";

const contentCardClass =
  "rounded-[1.7rem] border border-white/8 bg-[linear-gradient(180deg,rgba(10,15,12,0.94)_0%,rgba(7,11,9,0.9)_100%)] sm:rounded-[2rem]";

const insetCardClass =
  "rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)]";

function LiveDot({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.span
      className="inline-block h-2 w-2 rounded-full bg-primary"
      animate={
        reducedMotion
          ? undefined
          : {
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.15, 0.9],
            }
      }
      transition={
        reducedMotion ? undefined : { duration: 2.1, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );
}

function PreviewShell({
  children,
  reducedMotion,
}: {
  children: React.ReactNode;
  reducedMotion: boolean;
}) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimationControls();
  const hasStartedRef = useRef(false);
  const isInView = useInView(shellRef, {
    amount: 0.82,
    once: true,
    margin: "0px 0px -12% 0px",
  });

  useEffect(() => {
    if (!isInView || hasStartedRef.current === true) {
      return;
    }

    hasStartedRef.current = true;
    void controls.start("visible");
  }, [controls, isInView]);

  return (
    <motion.div
      ref={shellRef}
      variants={previewShell(reducedMotion)}
      initial="hidden"
      animate={controls}
      className="relative"
    >
      <div className="absolute inset-0 rounded-4xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_58%),radial-gradient(circle_at_bottom,rgba(37,201,133,0.08),transparent_46%)] blur-2xl sm:rounded-[2.4rem]" />
      <div className="relative overflow-hidden rounded-4xl border border-white/8 bg-[linear-gradient(180deg,rgba(10,15,12,0.98)_0%,rgba(6,9,7,1)_100%)] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.34)] sm:rounded-[2.4rem] sm:p-5 lg:p-6">
        <motion.div
          variants={previewItem(reducedMotion)}
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/16 to-transparent"
        />
        <motion.div
          variants={previewContent(reducedMotion)}
          className="relative overflow-hidden rounded-3xl will-change-transform sm:rounded-[1.85rem]"
          style={previewMaskStyle}
        >
          {children}
        </motion.div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#060907] via-[#060907]/96 to-transparent sm:h-28" />
      </div>
    </motion.div>
  );
}

function PaymentPreview({ reducedMotion }: { reducedMotion: boolean }) {
  const signals = [
    { label: "Counterparty", value: "Matched" },
    { label: "Approval gate", value: "Manual review" },
    { label: "Escrow mode", value: "Ready when needed" },
  ];

  return (
    <PreviewShell reducedMotion={reducedMotion}>
      <div className="min-h-84 bg-[radial-gradient(circle_at_top,rgba(37,201,133,0.08),transparent_52%)] p-1 sm:min-h-98 lg:min-h-104">
        <motion.div
          variants={previewGroup(reducedMotion)}
          className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/8 bg-white/3 px-3 py-1.5"
        >
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-white/8 px-2.5 py-1 text-[10px] font-semibold text-foreground">
              Checkout
            </span>
            <span className="rounded-lg border border-white/8 px-2.5 py-1 text-[10px] text-foreground/62">
              Waiting for approval
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-foreground/66">
            <LiveDot reducedMotion={reducedMotion} />
            Live review
          </div>
        </motion.div>

        <motion.div
          variants={previewGroup(reducedMotion)}
          className="mt-3.5 rounded-[1.4rem] border border-white/8 bg-white/3 p-3.5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/8 pb-3.5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Payment summary
              </p>
              <p className="mt-1.5 text-[1.1rem] font-semibold text-foreground sm:text-[1.18rem]">
                Merchant payment
              </p>
            </div>
            <div className="rounded-full border border-primary/18 bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary">
              Review first
            </div>
          </div>

          <div className="mt-3.5 space-y-2.5">
            {paymentReviewRows.map((row) => (
              <motion.div
                key={row.label}
                variants={previewItem(reducedMotion)}
                className="flex items-center justify-between gap-3 rounded-[0.95rem] border border-white/6 bg-background/32 px-3 py-2.5"
              >
                <span className="text-[0.88rem] text-muted-foreground">{row.label}</span>
                <span className="text-[0.88rem] font-semibold text-foreground">{row.value}</span>
              </motion.div>
            ))}
          </div>

          <motion.div variants={previewItem(reducedMotion)} className="mt-4">
            <div className="flex items-center justify-between text-[10px] text-foreground/58">
              <span>Readiness check</span>
              <span>72% confirmed</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-white/6">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-primary to-[#dfc28d]"
                initial={{ width: "0%" }}
                whileInView={{ width: reducedMotion ? "72%" : ["56%", "82%", "72%"] }}
                viewport={{ once: true, amount: 0.4 }}
                transition={
                  reducedMotion
                    ? { duration: 0.25 }
                    : { duration: 4.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                }
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={previewGroup(reducedMotion)}
          className="mt-3.5 grid gap-2.5 sm:grid-cols-3"
        >
          {signals.map((item) => (
            <motion.div
              key={item.label}
              variants={previewItem(reducedMotion)}
              className="rounded-[1.05rem] border border-white/8 bg-white/2.5 p-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/48">
                {item.label}
              </p>
              <p className="mt-1.5 text-[0.82rem] font-semibold text-foreground/86 sm:text-[0.86rem]">
                {item.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PreviewShell>
  );
}

function TransferPreview({ reducedMotion }: { reducedMotion: boolean }) {
  const reviewSteps = [
    { label: "Recipient verified", value: "Amina Textiles", state: "Matched" },
    { label: "Purpose attached", value: "Supplier settlement", state: "Included" },
    { label: "Fee handling", value: "Fixed before send", state: "Visible" },
  ];

  return (
    <PreviewShell reducedMotion={reducedMotion}>
      <div className="min-h-90 bg-[radial-gradient(circle_at_top,rgba(223,194,141,0.06),transparent_46%)] p-1 sm:min-h-108 lg:min-h-116">
        <motion.div
          variants={previewGroup(reducedMotion)}
          className="flex flex-wrap gap-2 rounded-[1.1rem] border border-white/8 bg-white/3 px-3 py-2"
        >
          {["Family support", "Merchant payout", "Invoice settlement"].map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-white/8 bg-white/3 px-2.5 py-1 text-[11px] font-medium text-foreground/72"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div
          variants={previewGroup(reducedMotion)}
          className="mt-4 rounded-[1.55rem] border border-white/8 bg-white/3 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Transfer review
              </p>
              <p className="mt-2 text-xl font-semibold text-foreground">Ready to send</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-3 py-1 text-[11px] font-medium text-foreground/68">
              <LiveDot reducedMotion={reducedMotion} />
              Confirmation required
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {reviewSteps.map((item) => (
              <motion.div
                key={item.label}
                variants={previewItem(reducedMotion)}
                className="flex flex-col gap-2 rounded-2xl border border-white/6 bg-background/32 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{item.value}</p>
                </div>
                <span className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[11px] font-medium text-foreground/70">
                  {item.state}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={previewGroup(reducedMotion)}
          className="mt-4 grid gap-2.5 sm:grid-cols-3"
        >
          {[
            { label: "Status", value: "Visible to both sides" },
            { label: "Review step", value: "Before send" },
            { label: "Trust layer", value: "Escrow optional" },
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={previewItem(reducedMotion)}
              className="rounded-[1.2rem] border border-white/8 bg-white/2.5 p-4 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/48">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground/86">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PreviewShell>
  );
}

function ApprovalPreview({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <PreviewShell reducedMotion={reducedMotion}>
      <div className="min-h-90 bg-[radial-gradient(circle_at_top,rgba(37,201,133,0.07),transparent_50%)] p-1 sm:min-h-108 lg:min-h-116">
        <motion.div
          variants={previewGroup(reducedMotion)}
          className="flex flex-wrap items-center justify-between gap-3 rounded-[1.1rem] border border-white/8 bg-white/3 px-3 py-2"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Before approval
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">Readable workflow</p>
          </div>
          <div className="rounded-full border border-primary/18 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
            Review layer
          </div>
        </motion.div>

        <motion.div variants={previewGroup(reducedMotion)} className="mt-4 space-y-3">
          {workflowSteps.map((item) => (
            <motion.div
              key={item.step}
              variants={previewItem(reducedMotion)}
              className="rounded-[1.35rem] border border-white/8 bg-white/3 p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/18 bg-primary/10 text-sm font-black text-primary">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={previewGroup(reducedMotion)}
          className="mt-4 grid gap-3 sm:grid-cols-2"
        >
          {visibilityRows.slice(0, 4).map((row) => (
            <motion.div
              key={row.label}
              variants={previewItem(reducedMotion)}
              className="rounded-[1.2rem] border border-white/8 bg-white/2.5 px-4 py-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/48">
                {row.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground/86">{row.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PreviewShell>
  );
}

export function LandingPage({ onConnect }: LandingPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMounted = useIsMounted();
  const reducedMotion = !isMounted || (prefersReducedMotion ?? false);

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
        className="relative min-h-svh overflow-hidden px-4 sm:px-6 lg:px-8 noise-overlay"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,20,13,0.62)_0%,rgba(4,16,11,0.3)_38%,rgba(4,12,9,0.16)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(ellipse_at_top,rgba(19,91,60,0.18),transparent_62%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[26%] bg-linear-to-t from-[rgba(5,20,13,0.92)] via-[rgba(5,20,13,0.7)] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-4xl flex-col items-center justify-start pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-44 lg:pb-36">
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="pointer-events-none absolute left-1/2 top-[44svh] h-[46svh] w-[210vw] max-w-none -translate-x-1/2 sm:top-[46svh] sm:h-[48svh] sm:w-[168vw] lg:w-[126vw]"
            style={{
              maskImage: "linear-gradient(to bottom, black 40%, transparent 90%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 90%)",
            }}
          >
            <Image
              src="/horizon_glow.png"
              alt=""
              fill
              className="object-cover mix-blend-screen opacity-80"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex max-w-3xl flex-col items-center pt-6 text-center sm:pt-8 lg:pt-0"
          >
            <div className="flex max-w-[18rem] flex-col items-center gap-1 text-center sm:max-w-none sm:flex-row sm:gap-2">
              <span className="text-[9px] font-black tracking-[0.12em] text-primary sm:text-[10px]">
                BYREIXWIFT
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-foreground/62 sm:text-[11px] sm:tracking-[0.18em]">
                Transparent payments on Sidrachain
              </span>
            </div>

            <h1 className="mt-5 max-w-2xl text-[clamp(2.35rem,14vw,3.75rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-foreground sm:mt-6 sm:text-[clamp(2.8rem,6vw,4.3rem)] sm:leading-[0.96]">
              Never sign a
              <span className="mt-2 block text-(--byreix-gold-soft)">transaction blindly.</span>
            </h1>

            <p className="mt-4.5 max-w-xl text-[0.98rem] leading-[1.72] text-muted-foreground sm:mt-5.5 sm:text-[1.03rem] lg:text-[1.08rem]">
              Preview every transaction, verify merchant identities, and reveal hidden fees before
              you sign. Deploy escrow on-demand to protect your high-value peer-to-peer deals.
            </p>

            <div className="mt-6 flex w-full max-w-lg flex-col gap-3 sm:mt-7 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
              <button
                onClick={onConnect}
                className="h-12 w-full justify-center rounded-xl bg-white px-7 text-base font-semibold text-black hover:bg-neutral-200 cursor-pointer flex items-center justify-center gap-2 sm:w-auto transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Open App
              </button>
              <button
                onClick={() => scrollToSection(HOME_SECTION_IDS.payments)}
                className="h-12 w-full justify-center rounded-xl border border-white/10 bg-white/4 px-7 text-base font-semibold text-neutral-300 hover:bg-white/8 cursor-pointer flex items-center justify-center gap-2 sm:w-auto transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                How it works
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id={HOME_SECTION_IDS.why}
        className="relative z-10 px-4 pb-12 pt-9 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:pb-20 lg:pt-16"
      >
        <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <motion.div {...sectionReveal(reducedMotion)} className="max-w-xl">
            <SectionLabel>Why ByReiXwift Exists</SectionLabel>
            <h2 className="mt-4 text-[1.82rem] font-bold leading-[1.04] tracking-tight text-foreground sm:mt-6 sm:text-[2.55rem] lg:text-[3.25rem]">
              Digital payments are easy to start and hard to verify.
            </h2>
            <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-[1.68] text-muted-foreground sm:mt-6 sm:text-lg">
              Fees, settlement terms, and trust gaps still show up too late. ByReiXwift is being
              built so you can review the deal before money moves.
            </p>
          </motion.div>

          <motion.div
            {...sectionReveal(reducedMotion, 0.08)}
            className="grid gap-3 sm:gap-4 sm:grid-cols-2"
          >
            <div className={`${contentCardClass} p-4.5 sm:p-6`}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/85">
                What users still face
              </p>
              <div className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4">
                {problemPoints.map((point) => (
                  <div key={point} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${contentCardClass} p-4.5 sm:p-6`}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--byreix-gold-soft)">
                What ByReiXwift changes
              </p>
              <div className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4">
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
      <section
        id={HOME_SECTION_IDS.overview}
        className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div
          className={`mx-auto max-w-6xl ${sectionWrapClass} px-4.5 py-7 sm:px-8 sm:py-10 lg:px-10`}
        >
          <motion.div
            {...sectionReveal(reducedMotion)}
            className="mx-auto flex max-w-3xl flex-col items-center text-center"
          >
            <p className="text-[0.78rem] font-bold uppercase tracking-[0.24em] text-primary/92 sm:text-[0.82rem]">
              What ByReiXwift Is
            </p>
            <h2 className="mt-4 text-[1.82rem] font-bold leading-[1.04] tracking-tight text-foreground sm:mt-5 sm:text-[2.5rem] lg:text-[3.2rem]">
              One product, three clear flows.
            </h2>
            <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-[1.68] text-muted-foreground sm:mt-5 sm:text-lg">
              Pay, send, or protect a transaction without guessing what happens next.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-3.5 sm:mt-12 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {platformPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.article
                  key={pillar.title}
                  {...sectionReveal(reducedMotion, 0.04 * index)}
                  className={`${contentCardClass} p-4.5 transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[rgba(223,194,141,0.2)] hover:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-[1.05rem] w-[1.05rem] shrink-0 text-primary/88" />
                    <h3 className="text-[1.35rem] font-semibold text-foreground sm:text-2xl">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-[0.95rem] leading-[1.64] text-muted-foreground sm:mt-3 sm:text-base">
                    {pillar.description}
                  </p>
                  <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-foreground/82 sm:mt-5 sm:pt-5">
                    {pillar.reason}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <motion.div
            {...sectionReveal(reducedMotion, 0.12)}
            className="mt-6 border-t border-white/8 pt-5 sm:px-1"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Supporting capability:</span> swap
              support can complement a payment flow when conversion matters, but it stays secondary
              to the review experience.
            </p>
          </motion.div>
        </div>
      </section>

      <section
        id={HOME_SECTION_IDS.payments}
        className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-7 sm:gap-10 lg:grid-cols-[0.96fr_0.9fr] lg:gap-16">
          <motion.div {...sectionReveal(reducedMotion)} className="max-w-xl">
            <SectionLabel>Payment Transparency</SectionLabel>
            <h2 className="mt-4 text-[1.88rem] font-bold leading-[1.04] tracking-tight text-foreground sm:mt-6 sm:text-[2.65rem] lg:text-[3.55rem]">
              See the payment before you approve it.
            </h2>
            <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-[1.68] text-muted-foreground sm:mt-6 sm:text-lg">
              Check the amount, fee, destination, and settlement mode before money moves.
            </p>
            <div className="mt-7 space-y-3.5 sm:mt-8 sm:space-y-4">
              {[
                "See the amount, fees, and destination in one review step.",
                "See the settlement mode before approval.",
                "Use escrow only when it helps.",
              ].map((point) => (
                <div key={point} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative lg:max-w-136 lg:justify-self-end">
            <PaymentPreview reducedMotion={reducedMotion} />
          </div>
        </div>
      </section>
      <section
        id={HOME_SECTION_IDS.transfers}
        className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-7 sm:gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div className="order-2 lg:order-1">
            <TransferPreview reducedMotion={reducedMotion} />
          </div>

          <motion.div {...sectionReveal(reducedMotion)} className="order-1 max-w-xl lg:order-2">
            <SectionLabel>Transfers</SectionLabel>
            <h2 className="mt-4 text-[1.82rem] font-bold leading-[1.04] tracking-tight text-foreground sm:mt-6 sm:text-[2.55rem] lg:text-[3.25rem]">
              Send with context, not guesswork.
            </h2>
            <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-[1.68] text-muted-foreground sm:mt-6 sm:text-lg">
              Send with a named recipient, clear purpose, and visible fee before you approve.
            </p>
            <div className="mt-6 grid gap-2.5 sm:mt-7 sm:grid-cols-3 sm:gap-3">
              {transferHighlights.map((item) => (
                <div
                  key={item.label}
                  className={`${insetCardClass} px-3 py-2.5 text-left sm:px-3.5 sm:py-3`}
                >
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-foreground/48">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-[0.9rem] font-semibold leading-snug text-foreground/88">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id={HOME_SECTION_IDS.escrow}
        className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto grid max-w-6xl gap-7 sm:gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <motion.div {...sectionReveal(reducedMotion)} className="max-w-xl">
            <SectionLabel>Escrow as Trust Layer</SectionLabel>
            <h2 className="mt-4 text-[1.82rem] font-bold leading-[1.04] tracking-tight text-foreground sm:mt-6 sm:text-[2.55rem] lg:text-[3.25rem]">
              Use escrow when trust needs structure.
            </h2>
            <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-[1.68] text-muted-foreground sm:mt-6 sm:text-lg">
              When a payment needs more structure, lock it first and release or refund with a clear
              state.
            </p>
            <div className={`mt-7 ${contentCardClass} p-4.5 sm:mt-8 sm:p-6`}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/85">
                When it helps most
              </p>
              <div className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4">
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

          <motion.div
            {...sectionReveal(reducedMotion, 0.08)}
            className="grid items-start gap-2.5 sm:grid-cols-2 sm:gap-4"
          >
            {escrowStates.map((state) => {
              const Icon = state.icon;
              return (
                <article
                  key={state.title}
                  className={`${contentCardClass} self-start p-3.5 transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/18 hover:shadow-[0_18px_40px_rgba(0,0,0,0.16)] sm:p-4.5`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-[1.05rem] w-[1.05rem] shrink-0 text-primary/88" />
                    <h3 className="text-[1.4rem] font-semibold tracking-tight text-foreground sm:text-[1.55rem]">
                      {state.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-[0.88rem] leading-[1.6] text-muted-foreground sm:text-[0.9rem]">
                    {state.copy}
                  </p>
                </article>
              );
            })}
          </motion.div>
        </div>
      </section>
      <section
        id={HOME_SECTION_IDS.principles}
        className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div
          className={`mx-auto grid max-w-6xl gap-7 ${sectionWrapClass} px-4.5 py-7 sm:gap-10 sm:px-8 sm:py-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:px-10`}
        >
          <motion.div {...sectionReveal(reducedMotion)} className="max-w-xl">
            <SectionLabel>Principles</SectionLabel>
            <h2 className="mt-4 text-[1.82rem] font-bold leading-[1.04] tracking-tight text-foreground sm:mt-6 sm:text-[2.55rem] lg:text-[3.25rem]">
              The product has to earn its language.
            </h2>
            <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-[1.68] text-muted-foreground sm:mt-6 sm:text-lg">
              Clear fees, visible approval, understandable states, and honest governance should show
              up in the product, not just the copy.
            </p>
          </motion.div>

          <motion.div
            {...sectionReveal(reducedMotion, 0.08)}
            className={`space-y-3 ${contentCardClass} p-4 sm:p-5`}
          >
            {principles.map((principle) => (
              <div
                key={principle.title}
                className={`flex flex-col gap-2 ${insetCardClass} px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6`}
              >
                <div className="sm:max-w-60">
                  <p className="text-sm font-semibold text-foreground">{principle.title}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground sm:max-w-90 sm:text-right">
                  {principle.copy}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id={HOME_SECTION_IDS.howItWorks}
        className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto grid max-w-6xl items-start gap-7 sm:gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <motion.div {...sectionReveal(reducedMotion)}>
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="mt-4 text-[1.82rem] font-bold leading-[1.04] tracking-tight text-foreground sm:mt-6 sm:text-[2.55rem] lg:text-[3.25rem]">
              A payment flow that stays readable.
            </h2>
            <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-[1.68] text-muted-foreground sm:mt-6 sm:text-lg">
              Connect when ready, review the details, then approve with context.
            </p>

            <div className="mt-7 space-y-6 sm:mt-10 sm:space-y-8">
              {workflowSteps.map((item) => (
                <div key={item.step} className="flex gap-4 sm:gap-6">
                  <div className="text-2xl font-black tracking-tight text-primary/30 sm:text-3xl">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div>
            <ApprovalPreview reducedMotion={reducedMotion} />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <motion.div {...sectionReveal(reducedMotion)} className="mx-auto max-w-4xl text-center">
          <div className="relative overflow-hidden rounded-[2.1rem] border border-white/8 bg-[linear-gradient(180deg,rgba(10,15,12,0.96)_0%,rgba(7,11,9,0.92)_100%)] p-6 sm:rounded-[2.5rem] sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-linear-to-b from-primary/8 via-transparent to-[rgba(223,194,141,0.05)]" />

            <div className="relative z-10">
              <h2 className="text-[1.82rem] font-bold leading-[1.04] tracking-tight text-foreground sm:text-[2.55rem] lg:text-[3.2rem]">
                Review the flow, then open the app with confidence.
              </h2>
              <p className="mx-auto mt-4 max-w-[34rem] text-[0.98rem] leading-[1.68] text-muted-foreground sm:mt-6 sm:text-lg">
                See how payments, transfers, and escrow fit together before you jump in.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:mt-10 sm:flex-row sm:gap-4">
                <button
                  onClick={onConnect}
                  className="h-12 w-full justify-center rounded-xl bg-white px-7 text-base font-semibold text-black hover:bg-neutral-200 cursor-pointer flex items-center justify-center gap-2 sm:w-auto transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Open App
                </button>
                <button
                  onClick={() => scrollToSection(HOME_SECTION_IDS.payments)}
                  className="h-12 w-full justify-center rounded-xl border border-white/10 bg-white/4 px-7 text-base font-semibold text-neutral-300 hover:bg-white/8 cursor-pointer flex items-center justify-center gap-2 sm:w-auto transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  How it works
                  <ArrowRight className="h-4 w-4 text-neutral-400" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
