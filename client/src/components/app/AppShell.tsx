"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnnouncementBanner, Navbar } from "@/components";
import { useAuthStore } from "@/store";

interface AppShellProps {
  children: ReactNode;
}

function getCurrentPage(pathname: string) {
  if (pathname.startsWith("/app/send")) {
    return "send";
  }

  if (pathname.startsWith("/app/swap")) {
    return "swap";
  }

  if (pathname.startsWith("/app/trends")) {
    return "trends";
  }

  if (pathname.startsWith("/app/escrow")) {
    return "escrow";
  }

  if (pathname.startsWith("/app/profile")) {
    return "profile";
  }

  return "wallet";
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, identity, logout } = useAuthStore();
  const currentPage = getCurrentPage(pathname);
  const connectedLabel =
    typeof identity === "string" && identity.length > 18
      ? `${identity.slice(0, 8)}...${identity.slice(-6)}`
      : (identity ?? undefined);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center text-muted-foreground">
        Redirecting to sign in...
      </div>
    );
  }

  const handleNavigate = (page: string) => {
    if (page === "home") {
      router.push("/app");
      return;
    }

    if (page === "wallet") {
      router.push("/app");
      return;
    }

    if (page === "send") {
      router.push("/app/send");
      return;
    }

    if (page === "swap") {
      router.push("/app/swap");
      return;
    }

    if (page === "trends") {
      router.push("/app/trends");
      return;
    }

    if (page === "escrow") {
      router.push("/app/escrow");
      return;
    }

    if (page === "profile") {
      router.push("/app/profile");
      return;
    }

    if (page === "cms") {
      router.push("/cms");
      return;
    }

    if (page.startsWith("/")) {
      router.push(page);
    }
  };

  const handleDisconnect = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        isConnected
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onDisconnect={handleDisconnect}
        connectedLabel={connectedLabel}
      />
      <main className="relative">{children}</main>
      <AnnouncementBanner />
    </div>
  );
}
