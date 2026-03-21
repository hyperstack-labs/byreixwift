import { Suspense } from "react";
import { PublicSiteShell } from "@/components/public/PublicSiteShell";
import { LoginRouteClient } from "@/components/public/LoginRouteClient";

function LoginFallback() {
  return (
    <PublicSiteShell currentPage="login">
      <div className="flex min-h-screen items-center justify-center px-4 pt-28 text-center text-muted-foreground">
        Loading sign-in options...
      </div>
    </PublicSiteShell>
  );
}

export default function LoginRoutePage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginRouteClient />
    </Suspense>
  );
}
