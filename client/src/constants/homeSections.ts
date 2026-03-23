export const HOME_SECTION_IDS = {
  hero: "hero",
  why: "why-byreixwift",
  overview: "platform-overview",
  payments: "payment-transparency",
  transfers: "transfers",
  escrow: "escrow-protection",
  principles: "principles",
  howItWorks: "how-it-works",
} as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[keyof typeof HOME_SECTION_IDS];

export const PUBLIC_HOME_NAV_LINKS: Array<{ label: string; id: HomeSectionId }> = [
  { label: "How It Works", id: HOME_SECTION_IDS.howItWorks },
  { label: "Principles", id: HOME_SECTION_IDS.principles },
];

export const HOME_SECTION_RAIL_LINKS: Array<{ label: string; id: HomeSectionId }> = [
  { label: "Problem", id: HOME_SECTION_IDS.why },
  { label: "Platform", id: HOME_SECTION_IDS.overview },
  { label: "Principles", id: HOME_SECTION_IDS.principles },
];
