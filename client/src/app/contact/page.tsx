import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Github, MessageSquareText, ShieldCheck } from "lucide-react";
import { PublicSiteShell } from "@/components/public/PublicSiteShell";
import {
  PublicGlassPanel,
  PublicPageHero,
  PublicSection,
  PublicSectionHeading,
} from "@/components/public/PublicPagePrimitives";

const contactRoutes = [
  {
    title: "SidraStart project page",
    description:
      "Use the official project page to review the public project context and follow the broader ByReiXwift story.",
    href: "https://www.sidrastart.com/project/a9b5bab5-f9aa-4b57-b342-52e870141d00",
    icon: MessageSquareText,
  },
  {
    title: "GitHub repository",
    description:
      "Best for implementation visibility, issue tracking, and technical progress around the product.",
    href: "https://github.com/hyperstack-labs/byreixwift",
    icon: Github,
  },
  {
    title: "Core team overview",
    description:
      "If you need to understand who is actively carrying product and engineering, start with the public team page.",
    href: "/team",
    icon: ShieldCheck,
  },
] as const;

const reachOutTopics = [
  "Merchant onboarding and product fit questions",
  "Platform partnerships and ecosystem conversations",
  "Trust, principles, or compliance-related discussion",
  "Technical collaboration or implementation feedback",
] as const;

export const metadata: Metadata = {
  title: "Contact | ByReiXwift",
  description:
    "Use the current public routes to reach the ByReiXwift project for product, partnership, and trust-related conversations.",
};

export default function ContactPage() {
  return (
    <PublicSiteShell currentPage="contact">
      <PublicPageHero
        eyebrow="Contact"
        title="Use the public routes that are active today."
        description="Use the route that fits your question, whether it is about the product, partnerships, principles, or implementation. This page stays simple on purpose so the paths listed here stay real and maintained."
        aside={
          <PublicGlassPanel className="max-w-xl lg:max-w-none">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--byreix-gold-soft)">
              Best use cases
            </p>
            <div className="mt-6 space-y-4">
              {reachOutTopics.map((topic) => (
                <div
                  key={topic}
                  className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)] p-4"
                >
                  <p className="text-sm leading-7 text-muted-foreground">{topic}</p>
                </div>
              ))}
            </div>
          </PublicGlassPanel>
        }
      />

      <PublicSection>
        <PublicSectionHeading
          eyebrow="Current starting points"
          title="Choose the route that best fits the conversation."
          description="Different questions belong in different places. The goal is to keep contact practical, clear, and honest about what is actually available today."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {contactRoutes.map((route) => {
            const isExternal = route.href.startsWith("http");

            return (
              <PublicGlassPanel key={route.title} className="flex h-full flex-col justify-between">
                <div>
                  <route.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-6 text-xl font-semibold text-foreground">{route.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {route.description}
                  </p>
                </div>
                {isExternal ? (
                  <a
                    href={route.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    Open resource
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <Link
                    href={route.href}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    Open overview
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </PublicGlassPanel>
            );
          })}
        </div>
      </PublicSection>

      <PublicSection className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <PublicSectionHeading
          eyebrow="Before you reach out"
          title="A little context helps us respond faster."
          description="If you are reaching out about product fit, implementation, or trust questions, include enough context so the team can understand the workflow you care about."
        />
        <PublicGlassPanel>
          <div className="grid gap-4">
            {[
              "Say whether your question is about product usage, partnership, compliance, or engineering.",
              "Include the workflow or use case you care about: payments, transfers, or escrow protection.",
              "If your question depends on implementation details, point to the relevant page, flow, or repository issue.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,17,14,0.82)_0%,rgba(8,12,10,0.68)_100%)] p-5"
              >
                <p className="text-sm leading-7 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </PublicGlassPanel>
      </PublicSection>

      <PublicSection className="pt-0">
        <PublicGlassPanel className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--byreix-gold-soft)">
              Related pages
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground">
              Need background before you contact us?
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Start with the product story, review the principles, or meet the core team before
              opening a conversation.
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
              href="/principles"
              className="rounded-full border border-border bg-background/72 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/25 hover:text-primary"
            >
              View principles
            </Link>
          </div>
        </PublicGlassPanel>
      </PublicSection>
    </PublicSiteShell>
  );
}
