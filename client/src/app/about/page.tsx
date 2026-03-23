import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, LockKeyhole, Send, ShieldCheck, Wallet } from "lucide-react";
import { PublicSiteShell } from "@/components/public/PublicSiteShell";
import {
  PublicGlassPanel,
  PublicPageHero,
  PublicSection,
  PublicSectionHeading,
} from "@/components/public/PublicPagePrimitives";

const platformPillars = [
  {
    title: "Online payments",
    description: "Review the amount, fee, and destination before a purchase is approved.",
    detail: "Buyers and merchants see the same terms before value moves.",
    icon: Wallet,
  },
  {
    title: "Transfers",
    description: "Send value to people, teams, and businesses with a clearer approval flow.",
    detail: "It is built for everyday movement of money, not just crypto-native actions.",
    icon: Send,
  },
  {
    title: "Escrow-backed protection",
    description:
      "Hold funds until the transaction condition is met, then release or refund cleanly.",
    detail: "Trust becomes part of the payment flow instead of an external promise.",
    icon: ShieldCheck,
  },
] as const;

const audienceCards = [
  {
    title: "Users who want clearer payments",
    copy: "For people who want to pay online without hidden fee behavior or vague transaction handling.",
  },
  {
    title: "Merchants who need better trust signals",
    copy: "For sellers who want a payment experience that feels modern without sacrificing clarity.",
  },
  {
    title: "Transactions that need protection",
    copy: "For higher-trust situations where a visible escrow state matters before funds are released.",
  },
] as const;

const differentiators = [
  "Transparent fixed-fee behavior before approval",
  "Escrow as a trust layer inside the payment flow",
  "Product direction shaped by ethical transaction design",
  "Supporting utilities can exist without replacing the payments-first identity",
] as const;

export const metadata: Metadata = {
  title: "About ByReiXwift",
  description:
    "Learn what ByReiXwift is, who it serves, and why it is being built as an online payment platform shaped by Shariah principles.",
};

export default function AboutPage() {
  return (
    <PublicSiteShell currentPage="about">
      <PublicPageHero
        eyebrow="About ByReiXwift"
        title="A payment platform built for clearer digital transactions."
        description="ByReiXwift is being built for clearer digital payments shaped by Shariah principles, bringing payments, transfers, and escrow-backed protection into one product."
        aside={
          <PublicGlassPanel className="max-w-xl lg:max-w-none">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--byreix-gold-soft)">
              What it covers
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {platformPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)] p-4"
                >
                  <pillar.icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-base font-semibold text-foreground">{pillar.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </PublicGlassPanel>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/principles"
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Read the principles
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/72 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/25 hover:text-primary"
          >
            Contact the team
          </Link>
        </div>
      </PublicPageHero>

      <PublicSection className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <PublicSectionHeading
          eyebrow="Why it exists"
          title="Online payments should not force users to trade clarity for convenience."
          description="Many digital payment flows still hide too much until the last step. Fees feel unclear, trust depends on assumption, and some transactions need more structure than a direct transfer can provide."
        />
        <PublicGlassPanel>
          <div className="space-y-5">
            {[
              "Make the amount, fee, and destination visible before approval.",
              "Support online shopping, direct transfers, and protected settlement in one platform.",
              "Treat trust as part of the product, not a line added after the interface is designed.",
            ].map((item) => (
              <div key={item} className="flex gap-4">
                <LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-7 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </PublicGlassPanel>
      </PublicSection>

      <PublicSection>
        <PublicSectionHeading
          eyebrow="Platform overview"
          title="One product, three core surfaces."
          description="ByReiXwift centers on online payments, direct transfers, and escrow-backed protection. These are not separate product stories. They are parts of the same payment system."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {platformPillars.map((pillar) => (
            <PublicGlassPanel key={pillar.title} className="h-full">
              <pillar.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-6 text-xl font-semibold text-foreground">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.description}</p>
              <p className="mt-5 border-t border-white/8 pt-5 text-sm leading-7 text-foreground/80">
                {pillar.detail}
              </p>
            </PublicGlassPanel>
          ))}
        </div>
      </PublicSection>

      <PublicSection className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <PublicGlassPanel>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--byreix-gold-soft)">
            Who it is for
          </p>
          <div className="mt-6 grid gap-4">
            {audienceCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)] p-5"
              >
                <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.copy}</p>
              </div>
            ))}
          </div>
        </PublicGlassPanel>
        <div className="rounded-[1.9rem] bg-[linear-gradient(180deg,rgba(9,13,11,0.56)_0%,rgba(7,10,8,0.28)_100%)] p-5 sm:rounded-[2.25rem] sm:p-8">
          <PublicSectionHeading
            eyebrow="What makes it different"
            title="The product should be easier to review, not louder to describe."
            description="ByReiXwift should feel credible because the product is easier to review, not because the language is louder. The point is to make the transaction itself clearer: what is being paid, what the fee is, who the counterparty is, and whether the flow needs escrow protection before funds move."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {differentiators.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)] p-5"
              >
                <p className="text-sm leading-7 text-foreground/85">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/75 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/25 hover:text-primary"
            >
              Meet the core team
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Return to the homepage
            </Link>
          </div>
        </div>
      </PublicSection>
    </PublicSiteShell>
  );
}
