"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnnouncementBanner, Footer, Navbar } from "@/components";
import { type HomeSectionId } from "@/constants/homeSections";

interface PublicSiteShellProps {
  currentPage: "about" | "team" | "principles" | "contact" | "login" | "privacy" | "terms";
  children: ReactNode;
}

export function PublicSiteShell({ currentPage, children }: PublicSiteShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const ctaLabel = currentPage === "login" ? "Back to Home" : "Launch App";
  const handleCta = () => {
    if (currentPage === "login") {
      router.push("/");
      return;
    }

    router.push("/app");
  };

  const handleSectionNavigate = (sectionId: HomeSectionId) => {
    if (pathname === "/") {
      const section = document.getElementById(sectionId);
      if (sectionId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    router.push(`/#${sectionId}`);
  };

  const handlePublicNavigate = (page: string) => {
    if (page === "/" || page === "home") {
      router.push("/");
      return;
    }

    if (page === "login") {
      router.push("/login");
      return;
    }

    if (page.startsWith("/")) {
      router.push(page);
    }
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <Navbar
        currentPage={currentPage}
        onNavigate={handlePublicNavigate}
        onSectionNavigate={handleSectionNavigate}
        onConnect={handleCta}
        ctaLabel={ctaLabel}
      />
      <main className="relative">{children}</main>
      <Footer onSectionNavigate={handleSectionNavigate} />
      <AnnouncementBanner />
    </div>
  );
}
