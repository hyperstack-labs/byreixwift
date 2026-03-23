import type { Metadata } from "next";
import { PublicSiteShell } from "@/components/public/PublicSiteShell";
import {
  PublicGlassPanel,
  PublicPageHero,
  PublicSection,
  PublicSectionHeading,
} from "@/components/public/PublicPagePrimitives";

const termAreas = [
  {
    title: "Public site use",
    copy: "The public website is provided to explain ByReiXwift, show the current product direction, and route users to the preview app or external public resources. It should not be interpreted as a final legal agreement for a live payment network.",
  },
  {
    title: "Preview app behavior",
    copy: "The current app experience still includes preview and mock behavior. Access to the preview app does not mean the platform is fully production-ready, and users should not treat the current flows as final financial infrastructure.",
  },
  {
    title: "Content and public claims",
    copy: "ByReiXwift aims to keep public content aligned with the actual product state. Even so, users should understand that roadmap elements, governance work, and implementation details can change as the platform matures.",
  },
] as const;

const expectationPoints = [
  "Use the public site and preview app as a current product view, not as final legal or financial documentation.",
  "Do not rely on preview flows as production-grade payments infrastructure.",
  "Expect the terms of use to become more formal as the product, operations, and compliance posture mature.",
] as const;

export const metadata: Metadata = {
  title: "Terms | ByReiXwift",
  description:
    "Read the current terms position for the ByReiXwift public site and preview app experience.",
};

export default function TermsPage() {
  return (
    <PublicSiteShell currentPage="terms">
      <PublicPageHero
        eyebrow="Terms"
        title="The current terms position for the public site and preview app."
        description="This page sets expectations for how the ByReiXwift public site and preview app should be understood today. It is a current-stage terms page, not the final production terms for a live payments platform."
      />

      <PublicSection>
        <PublicSectionHeading
          eyebrow="What these terms mean today"
          title="Clear expectations now, fuller legal terms before broad live use."
          description="The purpose of this page is simple: avoid pretending the site is legally finished when the product itself is still evolving. ByReiXwift should have stronger production-grade terms before wide public onboarding, live financial use, or formal operating-scale launch."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {termAreas.map((area) => (
            <PublicGlassPanel key={area.title} className="h-full">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {area.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{area.copy}</p>
            </PublicGlassPanel>
          ))}
        </div>
      </PublicSection>

      <PublicSection className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <PublicSectionHeading
          eyebrow="Expected use"
          title="Use the site as a current product reference, not a final operating contract."
          description="A responsible current-stage terms page should be readable and honest. It should help users understand what this site is, what it is not yet, and where stronger legal and operational terms still need to follow."
        />
        <PublicGlassPanel>
          <div className="grid gap-4">
            {expectationPoints.map((item) => (
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
    </PublicSiteShell>
  );
}
