import Link from "next/link";
import { ByreixLogo } from "./ByreixLogo";
import { ArrowUpRight } from "lucide-react";
import { HOME_SECTION_IDS, type HomeSectionId } from "@/constants/homeSections";

interface FooterProps {
  onSectionNavigate?: (sectionId: HomeSectionId) => void;
}

type FooterLink =
  | {
      label: string;
      sectionId: HomeSectionId;
    }
  | {
      label: string;
      href: string;
    };

const footerSections: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: "Platform",
    links: [
      { label: "Online Payments", sectionId: HOME_SECTION_IDS.payments },
      { label: "Transfers", sectionId: HOME_SECTION_IDS.transfers },
      { label: "Escrow Protection", sectionId: HOME_SECTION_IDS.escrow },
      { label: "How It Works", sectionId: HOME_SECTION_IDS.howItWorks },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Contact", href: "/contact" },
      { label: "Home", href: "/" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Why ByReiXwift", sectionId: HOME_SECTION_IDS.why },
      { label: "Principles", href: "/principles" },
      { label: "Platform Overview", sectionId: HOME_SECTION_IDS.overview },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "SidraStart Project",
        href: "https://www.sidrastart.com/project/a9b5bab5-f9aa-4b57-b342-52e870141d00",
      },
      { label: "GitHub Repository", href: "https://github.com/hyperstack-labs/byreixwift" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

function hasHref(link: FooterLink): link is Extract<FooterLink, { href: string }> {
  return "href" in link;
}

function isExternalHref(href: string) {
  return href.startsWith("http");
}

export function Footer({ onSectionNavigate }: FooterProps) {
  return (
    <footer className="mt-20 border-t border-border bg-background sm:mt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr]">
          <div className="max-w-md sm:col-span-2 xl:col-span-1">
            <ByreixLogo />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Online payments for users and merchants, built around transparent fees, transfers,
              escrow-backed protection, and a product direction shaped by Shariah principles.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Transparent fees", "Ethical commerce", "Escrow-backed protection"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-card/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-(--byreix-gold-soft)">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {hasHref(link) ? (
                      isExternalHref(link.href) ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSectionNavigate?.(link.sectionId)}
                        className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-7 text-sm text-muted-foreground sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <p>Copyright 2026 ByReiXwift. Clear payments. Stronger trust.</p>
          <p className="max-w-xl text-sm leading-relaxed sm:text-right">
            Built for users and merchants who need online payments, transfers, and escrow-backed
            protection with clearer terms from the start.
          </p>
        </div>
      </div>
    </footer>
  );
}
