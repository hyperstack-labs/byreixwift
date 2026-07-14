"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { api } from "@/lib/api";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function KycCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setKyc = useAuthStore((s) => s.setKyc);
  const done = useRef(false);

  const status = searchParams.get("status");

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const s = searchParams.get("status");
    const t = searchParams.get("tier");

    if (s) {
      setKyc(s, t || "");
      api.get("/kyc/status").then(({ data }) => {
        setKyc(data.kycStatus, data.kycTier || "");
      });
    }

    const timer = setTimeout(() => router.push("/app/profile"), 3000);
    return () => clearTimeout(timer);
  }, [searchParams, router, setKyc]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle>
            {status === "verified" ? "Verification Complete" : "Verification Submitted"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 pb-8">
          {status === "verified" ? (
            <ShieldCheck className="w-16 h-16 text-primary" />
          ) : status === "rejected" ? (
            <ShieldAlert className="w-16 h-16 text-red-500" />
          ) : (
            <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
          )}
          <p className="text-muted-foreground">
            {status === "verified"
              ? "Your identity has been verified. Redirecting..."
              : "Your verification is being reviewed. Redirecting..."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
