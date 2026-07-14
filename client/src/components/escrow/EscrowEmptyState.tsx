"use client";

import { Button } from "@/components/ui";
import { Inbox, Plus } from "lucide-react";

interface EscrowEmptyStateProps {
  onInitialize: () => void;
}

export function EscrowEmptyState({ onInitialize }: EscrowEmptyStateProps) {
  return (
    <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-linear-to-b from-card/50 to-transparent animate-in fade-in zoom-in-95 duration-700">
      <div className="relative inline-block mb-4">
        <Inbox className="w-12 h-12 mx-auto opacity-10 text-primary" />
        <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">No active escrows</h3>
      <p className="text-xs text-muted-foreground mt-2 max-w-50 mx-auto leading-relaxed">
        Securely hold funds for services or goods until both parties are satisfied.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-8 border-border hover:bg-background hover:text-primary transition-colors cursor-pointer"
        onClick={onInitialize}
      >
        <Plus className="w-3.5 h-3.5 mr-2" />
        Initialize First Escrow
      </Button>
    </div>
  );
}
