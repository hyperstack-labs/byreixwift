"use client";

import { Button } from "@/components/ui";
import {
  Loader2,
  Lock,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  X,
  AlertCircle,
  Wallet,
  FileText,
  Hash,
  Inbox,
  Check,
  ShieldCheck,
} from "lucide-react";
import { EscrowState, EscrowRecord, EscrowEventRecord } from "@/types/escrow";

interface TransactionModalProps {
  escrow: EscrowRecord;
  events: EscrowEventRecord[];
  isMutating: boolean;
  error?: string | null; 
  onLock: () => void;
  onRelease: () => void;
  onRefund: () => void;
  onClose: () => void;
}

// Need to turn this off in production
export const USE_MOCK = true;
// State config 
const STATE_STEPS: EscrowState[] = ["pending", "locked", "released"];


// Visual configuration for the various stages of the escrow lifecycle.
 
export const STATE_CONFIG: Record<
  EscrowState,
  {
    label: string;
    Icon: React.ElementType;
    dotClass: string;
    badgeClass: string;
    description: string;
  }
> = {
  pending: {
    label: "Pending",
    Icon: Clock,
    dotClass: "bg-yellow-400",
    badgeClass: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    description: "Awaiting buyer confirmation to lock funds into the contract.",
  },
  locked: {
    label: "Locked",
    Icon: Lock,
    dotClass: "bg-amber-400",
    badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    description: "Funds are secured in the smart contract. Neither party can access them until release or refund.",
  },
  released: {
    label: "Released",
    Icon: CheckCircle2,
    dotClass: "bg-green-400",
    badgeClass: "bg-green-500/10 text-green-400 border border-green-500/20",
    description: "Funds have been successfully released to the seller.",
  },
  refunded: {
    label: "Refunded",
    Icon: RotateCcw,
    dotClass: "bg-blue-400",
    badgeClass: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    description: "Funds have been returned to the buyer wallet.",
  },
};

const TRUSTLESS_PILLS = [
  "No intermediary",
  "Contract-enforced",
  "Non-custodial",
  "On-chain finality",
];

// Sub-components 
export function EscrowStatusBadge({ state }: { state: EscrowState }) {
  const { label, Icon, badgeClass } = STATE_CONFIG[state];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Visual stepper representing the on-chain progress
export function StateStepper({ state }: { state: EscrowState }) {
  if (state === "refunded") {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-full">
        <RotateCcw className="w-4 h-4 text-blue-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-300">Refunded</p>
          <p className="text-xs text-muted-foreground mt-0.5">Funds have been returned to the buyer wallet.</p>
        </div>
      </div>
    );
  }

  const currentIdx = STATE_STEPS.indexOf(state);

  return (
    <div className="flex items-start w-full px-1">
      {STATE_STEPS.map((step, i) => {
        const { label, Icon } = STATE_CONFIG[step];
        const isDone = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isLast = i === STATE_STEPS.length - 1;
        
        return (
          <div key={step} className={`flex items-center min-w-0 ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  isDone ? "bg-green-500/20 border-green-500/40" : isCurrent ? "bg-primary/20 border-primary" : "bg-card border-border"
                }`}
              >
                {/* Success feedback */}
                {isDone ? <Check className="w-4 h-4 text-green-400" /> : <Icon className={`w-4 h-4 ${isCurrent ? "text-primary" : "text-muted-foreground/40"}`} />}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium ${isCurrent ? "text-foreground" : isDone ? "text-green-500/70" : "text-muted-foreground/40"}`}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 flex items-center pb-5 px-1">
                <div className={`h-px w-full ${isDone ? "bg-green-500/40" : "bg-border"}`} />
                <ArrowRight className={`w-3 h-3 shrink-0 ${isDone ? "text-green-500/60" : "text-border"}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function TrustlessIndicators() {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm font-medium">Trustless escrow</p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Funds are held exclusively by the smart contract. No party including the platform can
        access or move funds outside the defined lifecycle rules.
      </p>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {TRUSTLESS_PILLS.map((pill) => (
          <span key={pill} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {pill}
          </span>
        ))}
      </div>
    </div>
  );
}

export function EscrowTransactionModal({
  escrow,
  events,
  isMutating,
  error,
  onLock,
  onRelease,
  onRefund,
  onClose,
}: TransactionModalProps) {
  const cfg = STATE_CONFIG[escrow.state];
  const canAct = (escrow.state === "pending" || escrow.state === "locked");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Action Feedback */}
        {isMutating && (
          <div className="absolute inset-0 z-50 bg-background/40 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-card p-4 rounded-xl border border-border shadow-xl flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm font-medium">Processing...</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border shrink-0">
          <div className="space-y-3 min-w-0 pr-4">
            <p className="font-bold truncate">{escrow.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <EscrowStatusBadge state={escrow.state} />
              <span className="text-xs text-muted-foreground">{new Date(escrow.createdAt).toLocaleDateString()}</span>
              {USE_MOCK && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">mock</span>
              )}
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="shrink-0 -mr-2 cursor-pointer">
            <X className="w-4 h-4 text-muted-foreground " />
          </Button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          
          {/* ERROR STATE */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-bold text-xs uppercase tracking-widest mb-0.5">Transaction Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${cfg.badgeClass}`}>
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-sm">{cfg.description}</p>
          </div>

          <div className="py-2">
            <p className="text-[10px] text-muted-foreground font-medium mb-4 uppercase tracking-wider">Transaction lifecycle</p>
            <StateStepper state={escrow.state} />
          </div>

          {/* Transaction Details */}
          <div>
            <p className="text-[10px] text-muted-foreground font-medium mb-3 uppercase tracking-wider">Transaction details</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-background/40 p-3">
                <p className="text-muted-foreground text-[10px] mb-1">Amount</p>
                <p className="font-semibold">{escrow.amount} <span className="text-[10px] text-muted-foreground font-normal">{escrow.tokenSymbol}</span></p>
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-3">
                <p className="text-muted-foreground text-[10px] mb-1">Fixed Fee</p>
                <p className="font-semibold">{escrow.fixedFee}</p>
              </div>
              <div className="col-span-2 rounded-xl border border-border bg-background/40 p-4 space-y-3">
                {[
                  { icon: Wallet, label: "Buyer", val: escrow.buyer },
                  { icon: Wallet, label: "Seller", val: escrow.seller },
                  { icon: Hash, label: "ID", val: escrow.id },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-center gap-3 group">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] text-muted-foreground w-12 uppercase">{label}</span>
                    <span className="text-xs font-mono ml-auto text-foreground bg-muted/30 px-2 py-0.5 rounded">{val.slice(0, 6)}...{val.slice(-4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TrustlessIndicators />
          {/* Event log, Clear Empty State logic */}
          <div className="pb-2">
            <p className="text-[10px] text-muted-foreground font-medium mb-3 uppercase tracking-wider">Event log</p>
            <div className="space-y-2">
              {events.length > 0 ? (
               events.map((ev) => (
                <div key={ev.id} className="flex items-start gap-3 rounded-xl border border-border bg-background/40 p-3 hover:bg-muted/20 transition-colors">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground mt-1 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold">{ev.type}</p>
                      <p className="text-[9px] text-muted-foreground opacity-60 uppercase">
                        {new Date(ev.occurredAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">Final State: {ev.state}</p>
                  </div>
                </div>
              ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-xl">
                  <Inbox className="w-6 h-6 text-muted-foreground/20 mb-2" /> {/* Empty state */}
                  <p className="text-xs text-muted-foreground">No events recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {canAct && (
          <div className="border-t border-border p-5 flex flex-col sm:flex-row gap-3 shrink-0 bg-card">
            {escrow.state === "pending" && (
              <Button
                size="lg"
                disabled={isMutating}
                onClick={onLock}
                className="bg-amber-600 hover:bg-amber-700 text-white flex-1 transition-all cursor-pointer"
              >
                {isMutating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                Lock funds
              </Button>
            )}

            {escrow.state === "locked" && (
              <Button
                size="lg"
                disabled={isMutating}
                onClick={onRelease}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 transition-all cursor-pointer"
              >
                {isMutating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Release funds
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              disabled={isMutating}
              onClick={onRefund}
              className="border-border hover:bg-secondary flex-1 transition-all cursor-pointer"
            >
              {isMutating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
              Refund
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}