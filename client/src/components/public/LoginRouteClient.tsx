"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LoginPage } from "@/components/pages";
import { PublicSiteShell } from "@/components/public/PublicSiteShell";
import { useAuthStore } from "@/store";

export function LoginRouteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const nextPath = useMemo(() => {
    const requestedPath = searchParams.get("next");

    if (requestedPath && requestedPath.startsWith("/")) {
      return requestedPath;
    }

    return "/app";
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isAuthenticated, nextPath, router]);

  const finishLogin = (message: string, identity: string) => {
    setIsLoading(true);

    window.setTimeout(() => {
      login(identity);
      toast.success(message);
      router.push(nextPath);
    }, 700);
  };

  return (
    <PublicSiteShell currentPage="login">
      <LoginPage
        isLoading={isLoading}
        onNavigate={(page) => {
          if (page === "home" || page === "/") {
            router.push("/");
            return;
          }

          if (page === "signup") {
            router.push("/contact");
            return;
          }

          if (page.startsWith("/")) {
            router.push(page);
            return;
          }

          router.push("/");
        }}
        onEmailLogin={({ email }) => finishLogin(`Preview access granted for ${email}.`, email)}
        onGoogleLogin={() => finishLogin("Preview Google access granted.", "demo@byreixwift.local")}
        onWalletConnect={() =>
          finishLogin(
            "Preview wallet access granted. Open the app to continue.",
            "wallet@byreixwift.local",
          )
        }
      />
    </PublicSiteShell>
  );
}
