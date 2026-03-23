import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Github, ShieldCheck } from "lucide-react";
import { PublicSiteShell } from "@/components/public/PublicSiteShell";
import {
  PublicGlassPanel,
  PublicPageHero,
  PublicSection,
  PublicSectionHeading,
} from "@/components/public/PublicPagePrimitives";
import { CORE_TEAM } from "@/constants/publicSite";

const workingPrinciples = [
  {
    title: "Clear ownership",
    copy: "People should be able to tell who is carrying product direction, implementation, and delivery.",
  },
  {
    title: "Tighter scope",
    copy: "The goal is steady execution with fewer rewrites, cleaner decisions, and work that fits the current stage.",
  },
  {
    title: "Product and public story aligned",
    copy: "The public website, product behavior, and roadmap should keep pointing in the same direction.",
  },
] as const;

export const metadata: Metadata = {
  title: "Team | ByReiXwift",
  description: "Meet the core team driving ByReiXwift across product, engineering, and delivery.",
};

export default function TeamPage() {
  return (
    <PublicSiteShell currentPage="team">
      <PublicPageHero
        eyebrow="Core Team"
        title="The people carrying product, engineering, and delivery."
        description="This page highlights the core contributors shaping ByReiXwift day to day. It stays intentionally lean so public ownership is easy to read and keep current."
        aside={
          <PublicGlassPanel className="max-w-xl lg:max-w-none">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--byreix-gold-soft)">
              Team focus
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)] p-5">
                <p className="text-sm leading-7 text-muted-foreground">
                  Product direction, delivery, and engineering stay linked so the public site, app
                  behavior, and roadmap move in the same direction.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)] p-5">
                <p className="text-sm leading-7 text-muted-foreground">
                  This is a focused public view of active ownership, not a mirror of every
                  contributor in the wider project.
                </p>
              </div>
            </div>
          </PublicGlassPanel>
        }
      />

      <PublicSection>
        <PublicSectionHeading
          eyebrow="Leadership and execution"
          title="Core ownership, kept readable."
          description="ByReiXwift sits within a broader project, but this page stays focused on the people directly guiding product decisions, architecture, and delivery."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {CORE_TEAM.map((member) => (
            <PublicGlassPanel key={member.name} className="flex h-full flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--byreix-gold-soft)">
                  ByReiXwift Core
                </p>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                  {member.name}
                </h3>
                <p className="mt-2 text-sm font-medium text-primary">{member.role}</p>
                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  Working across product direction, implementation quality, and delivery discipline
                  to keep the platform clear as it grows.
                </p>
              </div>
              <a
                href={member.href}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
              >
                <Github className="h-4 w-4" />
                View GitHub profile
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </PublicGlassPanel>
          ))}
        </div>
      </PublicSection>

      <PublicSection className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <PublicSectionHeading
          eyebrow="How we work"
          title="Small team, clear ownership."
          description="A public team page should do one thing well: show who is carrying the work and how the product is being kept aligned as it ships."
        />
        <div className="grid gap-4">
          {workingPrinciples.map((item) => (
            <PublicGlassPanel key={item.title}>
              <div className="flex gap-4">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.copy}</p>
                </div>
              </div>
            </PublicGlassPanel>
          ))}
        </div>
      </PublicSection>

      <PublicSection className="pt-0">
        <PublicGlassPanel className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--byreix-gold-soft)">
              Continue exploring
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground">
              Want the product view behind the people?
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Learn how the platform is framed publicly, what principles guide it, and where to
              reach the team through official project channels.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about"
              className="rounded-full border border-border bg-background/72 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/25 hover:text-primary"
            >
              About ByReiXwift
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-primary/25 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Contact channels
            </Link>
          </div>
        </PublicGlassPanel>
      </PublicSection>
    </PublicSiteShell>
  );
}
