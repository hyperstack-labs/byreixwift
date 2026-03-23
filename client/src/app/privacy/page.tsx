import type { Metadata } from "next";
import { PublicSiteShell } from "@/components/public/PublicSiteShell";
import {
  PublicGlassPanel,
  PublicPageHero,
  PublicSection,
  PublicSectionHeading,
} from "@/components/public/PublicPagePrimitives";

const privacyAreas = [
  {
    title: "Public website usage",
    copy: "The public site is meant to explain the product, route people to the right pages, and send interested users into the preview app. At this stage, it should be treated as a product website in progress rather than a finalized data-heavy service.",
  },
  {
    title: "Preview app access",
    copy: "Current sign-in flows open a preview app session. They are not yet the final production authentication system, and this page should not be read as a completed privacy policy for a full payments platform.",
  },
  {
    title: "External links and third parties",
    copy: "Some public pages route users to third-party resources such as SidraStart or GitHub. Once you leave the ByReiXwift site, those services operate under their own policies and controls.",
  },
] as const;

const privacyPromises = [
  "Keep public explanations aligned with what the product actually does today.",
  "Avoid publishing fake legal certainty before the full platform, auth flow, and operating model are in place.",
  "Replace this page with a production-grade privacy policy before broad public onboarding or sensitive data collection begins.",
] as const;

export const metadata: Metadata = {
  title: "Privacy | ByReiXwift",
  description:
    "Read the current privacy position for the ByReiXwift public site and preview app experience.",
};

export default function PrivacyPage() {
  return (
    <PublicSiteShell currentPage="privacy">
      <PublicPageHero
        eyebrow="Privacy"
        title="The current privacy position for the public site and preview app."
        description="This page explains how privacy is being approached at the current stage of ByReiXwift. It is written for the public website and preview app experience, and it should not be treated as the final production privacy policy for a live payment service."
      />

      <PublicSection>
        <PublicSectionHeading
          eyebrow="What this page covers"
          title="A current-stage privacy view, not finished legal infrastructure."
          description="ByReiXwift is still moving from product direction into fuller implementation. That means this page is meant to set clear expectations now, while leaving room for a more formal privacy policy once production auth, support, and platform operations are fully in place."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {privacyAreas.map((area) => (
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
          eyebrow="What we are trying to protect"
          title="Clear expectations matter as much as legal language at this stage."
          description="A trust-sensitive product should not pretend its privacy stack is more mature than it is. The practical goal right now is to avoid misleading users, keep preview behavior visible, and make sure a stronger policy replaces this page before broader real-world onboarding begins."
        />
        <PublicGlassPanel>
          <div className="grid gap-4">
            {privacyPromises.map((item) => (
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
