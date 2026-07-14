"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store";
import { Loader2, ShieldCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function KycVerifyButton() {
  const [loading, setLoading] = useState(false);
  const kycStatus = useAuthStore((s) => s.kycStatus);

  if (kycStatus === "approved") return null;

  const handleVerify = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/kyc/authorize");
      window.location.href = data.url;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const msg =
        axiosErr.response?.data?.message ||
        "KYC verification is not available right now";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleVerify}
      disabled={loading}
      variant={kycStatus === "pending" ? "outline" : "default"}
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ShieldCheck className="w-4 h-4" />
      )}
      {kycStatus === "pending" ? "Verifying..." : "Verify Identity"}
      <ExternalLink className="w-3 h-3 opacity-60" />
    </Button>
  );
}
