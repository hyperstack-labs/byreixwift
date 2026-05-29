"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnnouncementBanner, Footer, Navbar } from "@/components";
import { LandingPage } from "@/components/pages";
import { type HomeSectionId } from "@/constants/homeSections";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) {
      return;
    }

    const target = hash === "hero" ? document.body : document.getElementById(hash);
    if (!target) {
      return;
    }

    window.setTimeout(() => {
      if (hash === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }, []);

  const scrollToHomeSection = (sectionId: HomeSectionId) => {
    if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavigate = (page: string) => {
    if (page === "home" || page === "/") {
      scrollToHomeSection("hero");
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        currentPage="home"
        onConnect={() => router.push("/app")}
        onNavigate={handleNavigate}
        onSectionNavigate={scrollToHomeSection}
        ctaLabel="Open App"
      />

      <main className="relative">
        <LandingPage onNavigate={handleNavigate} onConnect={() => router.push("/app")} />
      </main>

      <Footer onSectionNavigate={scrollToHomeSection} />
      <AnnouncementBanner />
    </div>
  );
}
