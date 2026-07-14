"use client";

import { Card } from "@/components/ui";
import { Wallet, ArrowRight } from "lucide-react";
import { EscrowRecord } from "@/types/escrow";
import { EscrowStatusBadge, STATE_CONFIG } from "@/components/EscrowTransactionModal";

interface EscrowCardProps {
  escrow: EscrowRecord;
  isMutating: boolean;
  onSelect: (id: string) => void;
  cleanEscrowDescription: (e: EscrowRecord) => EscrowRecord;
}

export function EscrowCard({
  escrow,
  isMutating,
  onSelect,
  cleanEscrowDescription,
}: EscrowCardProps) {
  const lookupKey = escrow.state?.toUpperCase() as keyof typeof STATE_CONFIG;
  const cfg = STATE_CONFIG[lookupKey] || { dotClass: "bg-muted" };
  const cleanedEscrow = cleanEscrowDescription(escrow);

  return (
    <Card
      onClick={() => !isMutating && onSelect(escrow.id)}
      className={`p-4 bg-card border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group active:scale-[0.98] duration-200 ${
        isMutating ? "opacity-60 cursor-not-allowed pointer-events-none" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 text-left">
          <div
            className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)] ${cfg.dotClass}`}
          />
          <div className="min-w-0">
            <p className="font-semibold truncate group-hover:text-primary transition-all duration-200 group-hover:translate-x-0.5">
              {cleanedEscrow.description}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground/70 font-mono">
              <Wallet className="w-3 h-3 shrink-0 opacity-60" />
              <span>{escrow.buyer ? escrow.buyer.slice(0, 6) : "0x000"}...</span>
              <ArrowRight className="w-2.5 h-2.5 opacity-30 shrink-0" />
              <span>{escrow.seller ? escrow.seller.slice(0, 6) : "0x000"}...</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/40 mt-2 font-bold">
              {new Date(escrow.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}{" "}
              •{" "}
              {new Date(escrow.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <p className="font-bold text-xs tabular-nums text-right mr-2">
            {escrow.amount}{" "}
            <span className="text-[10px] text-muted-foreground/60 font-medium">
              {escrow.tokenSymbol}
            </span>
          </p>
          <EscrowStatusBadge state={escrow.state} />
        </div>
      </div>
    </Card>
  );
}
