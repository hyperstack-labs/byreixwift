import Link from "next/link";
import type { Metadata } from "next";
import { Eye, LockKeyhole, Scale, ShieldCheck, Wallet } from "lucide-react";
import { PublicSiteShell } from "@/components/public/PublicSiteShell";
import {
  PublicGlassPanel,
  PublicPageHero,
  PublicSection,
  PublicSectionHeading,
} from "@/components/public/PublicPagePrimitives";

const trustPillars = [
  {
    title: "Fixed fee visibility",
    copy: "Users should be able to review the amount, fee, and destination before approval instead of discovering costs after the fact.",
    icon: Wallet,
  },
  {
    title: "Ethical transaction design",
    copy: "The product direction should avoid interest-like behavior and keep fee handling understandable from the start.",
    icon: Scale,
  },
  {
    title: "Direct control",
    copy: "Custody and approval should stay visible to the user rather than being hidden behind opaque processing language.",
    icon: ShieldCheck,
  },
  {
    title: "Escrow state clarity",
    copy: "When a transaction needs protection, the status should show whether funds are locked, released, or refunded.",
    icon: LockKeyhole,
  },
] as const;

const productImplications = [
  "Pay online with clearer transaction review before value moves.",
  "Send funds with the same expectation of visible fees and destination clarity.",
  "Use escrow only where protection is needed, with states that can be understood at a glance.",
] as const;

export const metadata: Metadata = {
  title: "Principles | ByReiXwift",
  description:
    "See the principles that shape ByReiXwift across fees, custody, escrow, and ethical transaction design.",
};

export default function PrinciplesPage() {
  return (
    <PublicSiteShell currentPage="principles">
      <PublicPageHero
        eyebrow="Principles"
        title="The product should show its principles in the flow."
        description="ByReiXwift is being built around visible fees, clear approval, and transaction states people can actually understand. This page explains the standards guiding the product and where governance work is still in progress."
        aside={
          <PublicGlassPanel className="max-w-xl lg:max-w-none">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--byreix-gold-soft)">
              How to read this page
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)] p-5">
                <p className="text-sm leading-7 text-muted-foreground">
                  This page explains the standards shaping the product. It is not a substitute for
                  governance, legal review, or qualified Shariah oversight.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)] p-5">
                <p className="text-sm leading-7 text-muted-foreground">
                  Strong wording without operational substance weakens trust. The product has to
                  earn the language it uses.
                </p>
              </div>
            </div>
          </PublicGlassPanel>
        }
      />

      <PublicSection>
        <PublicSectionHeading
          eyebrow="Trust pillars"
          title="Four principles should stay visible in every core flow."
          description="If people cannot review the amount, fee, destination, or escrow state before they act, trust depends too much on assumption. These principles exist to keep the product legible as it grows."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {trustPillars.map((pillar) => (
            <PublicGlassPanel key={pillar.title} className="h-full">
              <pillar.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-6 text-xl font-semibold text-foreground">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.copy}</p>
            </PublicGlassPanel>
          ))}
        </div>
      </PublicSection>

      <PublicSection className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <PublicSectionHeading
          eyebrow="Shariah direction"
          title="Shariah language should follow product behavior."
          description="Calling a system Shariah-compliant is a meaningful claim. It should be supported by visible fees, understandable transaction terms, and the governance work needed to keep those claims credible over time."
        />
        <PublicGlassPanel>
          <div className="flex gap-4">
            <Eye className="mt-1 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-base font-semibold text-foreground">Product behavior</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Users should be able to review a payment before approval, understand how a fee is
                applied, and see whether a protected transaction is pending, locked, released, or
                refunded.
              </p>
            </div>
          </div>
        </PublicGlassPanel>
      </PublicSection>

      <PublicSection>
        <PublicGlassPanel className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--byreix-gold-soft)">
              What this means in product terms
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground">
              Principles only matter if they change what users can review before they act.
            </h2>
            <div className="mt-8 grid gap-4">
              {productImplications.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)] p-5"
                >
                  <p className="text-sm leading-7 text-foreground/85">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--byreix-gold-soft)">
              Governance in progress
            </p>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Strong public trust needs more than a polished homepage. Governance, legal review, and
              qualified Shariah oversight still matter. This page exists to define the product
              behavior we expect, not to skip the work required to sustain it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="rounded-full border border-border bg-background/72 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/25 hover:text-primary"
              >
                About the platform
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-primary/25 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Reach the team
              </Link>
            </div>
          </div>
        </PublicGlassPanel>
      </PublicSection>
    </PublicSiteShell>
  );
}
