"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
  Textarea,
} from "@/components/ui";
import { AlertCircle, CheckCircle2, Loader2, Plus, ExternalLink } from "lucide-react";
import { EscrowRecord } from "@/types/escrow";

interface CreateEscrowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMutating: boolean;
  connectedAddress: string | undefined;
  formData: {
    seller: string;
    amount: string;
    token: string;
    description: string;
    fixedFee: string;
  };
  onChangeFormData: (data: {
    seller: string;
    amount: string;
    token: string;
    description: string;
    fixedFee: string;
  }) => void;
  formErrors: Record<string, string>;
  onCreate: () => void;
  creationSuccessData: EscrowRecord | null;
  onViewDetails: (id: string) => void;
  onClose: () => void;
  mode: "simulation" | "live";
  setMode: (mode: "simulation" | "live") => void;
}

export function CreateEscrowDialog({
  open,
  onOpenChange,
  isMutating,
  connectedAddress,
  formData,
  onChangeFormData,
  formErrors,
  onCreate,
  creationSuccessData,
  onViewDetails,
  onClose,
  mode,
  setMode,
}: CreateEscrowDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-4 self-start sm:self-center sm:flex-row sm:items-center">
        {/* Live Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs font-semibold shadow-inner">
          <button
            type="button"
            onClick={() => setMode("simulation")}
            className={`px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
              mode === "simulation"
                ? "bg-neutral-800 text-gray-400 border-neutral-700/50 shadow-md font-bold"
                : "bg-transparent text-neutral-500 border-transparent hover:text-neutral-300 font-bold"
            }`}
          >
            Simulation
          </button>
          <button
            type="button"
            onClick={() => setMode("live")}
            className={`px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
              mode === "live"
                ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/20 font-bold"
                : "bg-transparent text-neutral-500 border-transparent hover:text-neutral-300 font-bold"
            }`}
          >
            Live
          </button>
        </div>
        <div className="w-fit">
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer font-bold"
            >
              <Plus className="w-4 h-4 " />
              New
            </Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-card border-border p-0 overflow-hidden flex flex-col max-h-[90vh]">
        {!creationSuccessData ? (
          <>
            <DialogHeader className="p-6 border-b border-border shrink-0">
              <DialogTitle>New Escrow</DialogTitle>
              <DialogDescription>
                Funds will be held by the smart contract until all parties act.
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="buyer" className="text-sm">
                    Buyer Wallet
                  </Label>
                  {formErrors.buyer && (
                    <span className="text-[10px] text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-right-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.buyer}
                    </span>
                  )}
                </div>
                <Input
                  id="buyer"
                  readOnly
                  value={connectedAddress ?? ""}
                  placeholder="Connect wallet to auto-fill"
                  className="bg-muted/40 font-mono text-sm border-border text-muted-foreground cursor-default select-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="seller" className="text-sm">
                    Seller Wallet
                  </Label>
                  {formErrors.seller && (
                    <span className="text-[10px] text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-right-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.seller}
                    </span>
                  )}
                </div>
                <Input
                  id="seller"
                  placeholder="0x..."
                  disabled={isMutating}
                  value={formData.seller}
                  onChange={(e) => onChangeFormData({ ...formData, seller: e.target.value })}
                  className={`bg-background font-mono text-sm transition-colors ${
                    formErrors.seller ? "border-red-500 ring-1 ring-red-500/20" : "border-border"
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="amount" className="text-sm">
                      Amount
                    </Label>
                    {formErrors.amount && (
                      <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" />
                    )}
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    disabled={isMutating}
                    value={formData.amount}
                    onChange={(e) => onChangeFormData({ ...formData, amount: e.target.value })}
                    className={`bg-background transition-colors ${
                      formErrors.amount ? "border-red-500 ring-1 ring-red-500/20" : "border-border"
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="fixedFee" className="text-sm">
                      Fee
                    </Label>
                    {formErrors.fixedFee && (
                      <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" />
                    )}
                  </div>
                  <Input
                    id="fixedFee"
                    type="number"
                    placeholder="0.00"
                    disabled={isMutating}
                    value={formData.fixedFee}
                    onChange={(e) => onChangeFormData({ ...formData, fixedFee: e.target.value })}
                    className={`bg-background transition-colors ${
                      formErrors.fixedFee
                        ? "border-red-500 ring-1 ring-red-500/20"
                        : "border-border"
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="token" className="text-sm">
                      Token
                    </Label>
                    {formErrors.token && (
                      <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" />
                    )}
                  </div>
                  <Input
                    id="token"
                    disabled={isMutating}
                    value={formData.token}
                    onChange={(e) => onChangeFormData({ ...formData, token: e.target.value })}
                    className={`bg-background transition-colors ${
                      formErrors.token
                        ? "border-red-500 ring-1 ring-red-500/20"
                        : "border-border text-muted-foreground"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description" className="text-sm">
                    Description
                  </Label>
                  {formErrors.description && (
                    <span className="text-[10px] text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-right-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.description}
                    </span>
                  )}
                </div>
                <Textarea
                  id="description"
                  placeholder="Purpose of transaction"
                  disabled={isMutating}
                  value={formData.description}
                  onChange={(e) => onChangeFormData({ ...formData, description: e.target.value })}
                  className={`bg-background min-h-20 transition-colors ${
                    formErrors.description
                      ? "border-red-500 ring-1 ring-red-500/20"
                      : "border-border"
                  }`}
                />
              </div>
            </div>

            <div className="p-6 border-t border-border bg-card flex gap-2 shrink-0">
              <Button
                variant="outline"
                disabled={isMutating}
                onClick={onClose}
                className="flex-1 border-border cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={onCreate}
                disabled={isMutating}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              >
                {isMutating ? (
                  <span className="flex items-center justify-center gap-2 whitespace-nowrap animate-in fade-in duration-200">
                    <Loader2 className="w-4 h-4 animate-spin" /> Initializing...
                  </span>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <DialogTitle className="text-xl">Escrow Initialized</DialogTitle>
            <DialogDescription className="mt-2 text-balance">
              Escrow <span className="font-mono text-foreground">{creationSuccessData.id}</span> has
              been successfully created.
            </DialogDescription>

            <div className="w-full mt-8 p-4 rounded-xl border border-border bg-muted/30 space-y-3 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold">
                  {creationSuccessData.amount} {creationSuccessData.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Seller:</span>
                <span className="font-mono">
                  {creationSuccessData.seller
                    ? `${creationSuccessData.seller.slice(0, 10)}...`
                    : "0x..."}
                </span>
              </div>
            </div>

            <div className="w-full mt-8 flex flex-col gap-2">
              <Button
                className="w-full bg-primary text-primary-foreground cursor-pointer"
                onClick={() => onViewDetails(creationSuccessData.id)}
              >
                View Details
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
