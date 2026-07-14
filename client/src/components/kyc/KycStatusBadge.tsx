"use client";

import { ShieldCheck, ShieldAlert, ShieldOff, Loader2, Clock } from "lucide-react";

interface KycStatusBadgeProps {
  status: string | null;
  tier?: string | null;
}

const tierLabel: Record<string, string> = {
  t0: "Basic",
  t1: "Standard",
  t2: "Enhanced",
  t3: "Maximum",
};

export function KycStatusBadge({ status, tier }: KycStatusBadgeProps) {
  if (!status || status === "unverified" || status === "none") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
        <ShieldOff className="w-3 h-3" />
        Not Verified
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500">
        <Loader2 className="w-3 h-3 animate-spin" />
        Pending
      </span>
    );
  }

  if (status === "verified") {
    const t = tier ? tierLabel[tier] || tier.toUpperCase() : "";
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
        <ShieldCheck className="w-3 h-3" />
        Verified{t ? ` · ${t}` : ""}
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-500">
        <ShieldAlert className="w-3 h-3" />
        Rejected
      </span>
    );
  }

  if (status === "expired") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
        <Clock className="w-3 h-3" />
        Expired
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
      <ShieldOff className="w-3 h-3" />
      {status}
    </span>
  );
}
