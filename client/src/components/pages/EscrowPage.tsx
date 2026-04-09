"use client";

import { useState, useCallback } from "react";
import {
  Card,
  Button,
  Input,
  Label,
  Textarea,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui";
import { Loader2, Plus, Inbox, Wallet, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateEscrow,
  useEscrowEvents,
  useEscrows,
  useLockEscrow,
  useRefundEscrow,
  useReleaseEscrow,
} from "@/hooks";
import { EscrowState, EscrowRecord, EscrowEventRecord } from "@/types/escrow";
import {
  EscrowTransactionModal,
  EscrowStatusBadge,
  STATE_CONFIG,
  USE_MOCK,
} from "@/components/EscrowTransactionModal";

let _mockStore: EscrowRecord[] = [ // Temporarily remove value to see empty state
  {
    id: "esc-001-mock",
    buyer: "0x742d35Cc6634C0532925a3b844Bc454e7595f9aB8",
    seller: "0x9f3aD15A12e1F3514d8B8E9c6F16C2E8922A7cD2",
    amount: 250,
    tokenSymbol: "SDA",
    fixedFee: 5,
    description: "Website redesign milestone #1",
    state: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

const _mockEventStore: Record<string, EscrowEventRecord[]> = {
  "esc-001-mock": [
    {
      id: "e1",
      escrowId: "esc-001-mock",
      type: "EscrowCreated",
      state: "pending",
      occurredAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ],
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Mock hooks

function useMockEscrows() {
  const [escrows, setEscrows] = useState<EscrowRecord[]>(_mockStore);
  const refresh = useCallback(() => setEscrows([..._mockStore]), []);
  return { data: escrows, isLoading: false, error: null, refresh };
}

function useMockEscrowEvents(id: string | null) {
  const [events, setEvents] = useState<EscrowEventRecord[]>(id ? (_mockEventStore[id] ?? []) : []);
  const refresh = useCallback(
    (newId: string | null) => setEvents(newId ? (_mockEventStore[newId] ?? []) : []),
    []
  );
  return { data: events, refresh };
}

function useMockCreateEscrow(refreshEscrows: () => void) {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = useCallback(
    async (payload: Omit<EscrowRecord, "id" | "state" | "createdAt">) => {
      setIsPending(true);
      await sleep(600);
      const newEscrow: EscrowRecord = {
        ...payload,
        id: `esc-${Date.now()}-mock`,
        state: "pending",
        createdAt: new Date().toISOString(),
      };
      _mockStore = [newEscrow, ..._mockStore];
      _mockEventStore[newEscrow.id] = [
        {
          id: `e-${Date.now()}`,
          escrowId: newEscrow.id,
          type: "EscrowCreated",
          state: "pending",
          occurredAt: new Date().toISOString(),
        },
      ];
      setIsPending(false);
      refreshEscrows();
      return { escrow: newEscrow };
    },
    [refreshEscrows]
  );
  return { isPending, mutateAsync };
}

function useMockTransition(refreshEscrows: () => void, refreshEvents: (id: string | null) => void) {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(
    async (action: "lock" | "release" | "refund", id: string) => {
      setIsPending(true);
      await sleep(600);
      const nextState: Record<string, EscrowState> = {
        lock: "locked",
        release: "released",
        refund: "refunded",
      };
      const evtType: Record<string, EscrowEventRecord["type"]> = {
        created: "EscrowCreated",
        lock: "TransactionLocked",
        release: "FundsReleased",
        refund: "FundsRefunded",
      };
      _mockStore = _mockStore.map((e) => (e.id === id ? { ...e, state: nextState[action] } : e));
      _mockEventStore[id] = [
        ...(_mockEventStore[id] ?? []),
        {
          id: `e-${Date.now()}`,
          escrowId: id,
          type: evtType[action],
          state: nextState[action],
          occurredAt: new Date().toISOString(),
        },
      ];
      setIsPending(false);
      refreshEscrows();
      refreshEvents(id);
    },
    [refreshEscrows, refreshEvents]
  );
  return { isPending, mutate };
}

// EscrowPage
const DEFAULT_BUYER = "0x742d35Cc6634C0532925a3b844Bc454e7595f9aB";
const DEFAULT_SELLER = "0x9f3aD15A12e1F3514d8B8E9c6F16C2E8922A7cD2";
const isValidAddress = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a);

export function EscrowPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEscrowId, setSelectedEscrowId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    buyer: DEFAULT_BUYER,
    seller: DEFAULT_SELLER,
    amount: "",
    token: "SDA",
    description: "",
    fixedFee: "0",
  });

  // Mock hooks (always constructed — hooks can't be conditional)
  const mockEscrows = useMockEscrows();
  const mockEvents = useMockEscrowEvents(selectedEscrowId);
  const mockCreate = useMockCreateEscrow(mockEscrows.refresh);
  const mockTransition = useMockTransition(mockEscrows.refresh, mockEvents.refresh);

  // Real hooks (always constructed, only used when USE_MOCK = false)
  const escrowRecord = useEscrows();
  const escrowEvents = useEscrowEvents(USE_MOCK ? null : selectedEscrowId);
  const createEscrow = useCreateEscrow();
  const lockEscrow = useLockEscrow();
  const releaseEscrow = useReleaseEscrow();
  const refundEscrow = useRefundEscrow();

  const escrows = USE_MOCK ? mockEscrows.data : (escrowRecord.data ?? []);
  const events = USE_MOCK ? mockEvents.data : (escrowEvents.data ?? []);
  const isLoading = USE_MOCK ? false : escrowRecord.isLoading; // Set to true temporarily to see skeleton rendering
  const error = USE_MOCK ? null : escrowRecord.error; // const error = "Failed to synchronize with the smart contract. Please check your connection"; // replace with for temporary error feedback rendering
  
  const selectedEscrow = selectedEscrowId
    ? (escrows.find((e) => e.id === selectedEscrowId) ?? null)
    : null;

  const totalLocked = escrows
    .filter((e) => e.state === "pending" || e.state === "locked")
    .reduce((s, e) => s + e.amount, 0);

  const isMutating = USE_MOCK
    ? mockCreate.isPending || mockTransition.isPending
    : createEscrow.isPending ||
      lockEscrow.isPending ||
      releaseEscrow.isPending ||
      refundEscrow.isPending;

  const resetForm = () =>
    setFormData({
      buyer: DEFAULT_BUYER,
      seller: DEFAULT_SELLER,
      amount: "",
      token: "SDA",
      description: "",
      fixedFee: "0",
    });

  const handleCreateEscrow = async () => {
    if (!formData.buyer || !formData.seller || !formData.amount || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isValidAddress(formData.buyer) || !isValidAddress(formData.seller)) {
      toast.error("Invalid wallet address (0x + 40 hex chars)");
      return;
    }

    const payload = {
      buyer: formData.buyer,
      seller: formData.seller,
      amount: Number(formData.amount),
      tokenSymbol: formData.token,
      description: formData.description,
      fixedFee: Number(formData.fixedFee || "0"),
      state: "pending" as EscrowState,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const result = USE_MOCK
        ? await mockCreate.mutateAsync(payload)
        : await createEscrow.mutateAsync(payload);
      toast.success("Escrow created");
      setSelectedEscrowId(result.escrow.id);
      setShowCreateDialog(false);
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create escrow");
    }
  };

  const handleTransition = async (
    action: "lock" | "release" | "refund",
    id: string,
    actor: string
  ) => {
    try {
      // throw new Error("User rejected the transaction request."); // For error testing purposes
      if (USE_MOCK) {
        await mockTransition.mutate(action, id);
      } else {
        if (action === "lock") await lockEscrow.mutateAsync({ id, payload: { actor } });
        if (action === "release") await releaseEscrow.mutateAsync({ id, payload: { actor } });
        if (action === "refund") await refundEscrow.mutateAsync({ id, payload: { actor } });
      }
      // Action Feedback
      toast.success(
        { lock: "Escrow locked", release: "Funds released", refund: "Escrow refunded" }[action]
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update escrow");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-foreground">Escrow</h1>
              {USE_MOCK && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  Demo Mode
                </span>
              )}
            </div>
            <div className="min-h-10">
              {!isLoading ? (
                <p className="text-sm text-muted-foreground mt-1 animate-in fade-in duration-500">
                  {escrows.length} records —{" "}
                  <span className="font-medium text-foreground">
                    {totalLocked.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>{" "}
                  units locked
                </p>
              ) : (
                <div className="h-4 w-48 bg-muted/20 animate-pulse rounded mt-2" />
              )}
            </div>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </DialogTrigger>

            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-card border-border p-0 overflow-hidden flex flex-col max-h-[90vh]">
              <DialogHeader className="p-6 border-b border-border shrink-0">
                <DialogTitle>New Escrow</DialogTitle>
                <DialogDescription>
                  Funds will be held by the smart contract until all parties act.
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="space-y-1.5">
                  <Label htmlFor="buyer" className="text-sm">
                    Buyer Wallet
                  </Label>
                  <Input
                    id="buyer"
                    placeholder="0x..."
                    value={formData.buyer}
                    onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                    className="bg-background border-border font-mono text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="seller" className="text-sm">
                    Seller Wallet
                  </Label>
                  <Input
                    id="seller"
                    placeholder="0x..."
                    value={formData.seller}
                    onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                    className="bg-background border-border font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="amount" className="text-sm">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fixedFee" className="text-sm">
                      Fee
                    </Label>
                    <Input
                      id="fixedFee"
                      type="number"
                      placeholder="0.00"
                      value={formData.fixedFee}
                      onChange={(e) => setFormData({ ...formData, fixedFee: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="token" className="text-sm">
                      Token
                    </Label>
                    <Input
                      id="token"
                      value={formData.token}
                      onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                      className="bg-background border-border text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Purpose of transaction"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-background border-border min-h-20"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-border bg-card flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    resetForm();
                  }}
                  className="flex-1 border-border cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEscrow}
                  disabled={isMutating}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                >
                  {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Error State */}
        {error && (
          <Card className="p-4 mb-4 border-red-500/40 bg-red-500/10 text-red-200">
            {error instanceof Error ? error.message : "Failed to load escrow records"}
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-25 w-full rounded-xl border border-border bg-card/50 animate-pulse flex items-center px-4 justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted/50 rounded" />
                  </div>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-5 w-20 bg-muted/50 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        <div className="space-y-3">
          {escrows.map((escrow) => {
            const cfg = STATE_CONFIG[escrow.state as keyof typeof STATE_CONFIG];
            return (
              <Card
                key={escrow.id}
                onClick={() => setSelectedEscrowId(escrow.id)}
                className="p-4 bg-card border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group active:scale-[0.98] duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 text-left">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)] ${cfg.dotClass}`}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold truncate group-hover:text-primary transition-all duration-200 group-hover:translate-x-0.5">
                        {escrow.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground/70 font-mono">
                        <Wallet className="w-3 h-3 shrink-0 opacity-60" />
                        <span>{escrow.buyer.slice(0, 6)}...</span>
                        <ArrowRight className="w-2.5 h-2.5 opacity-30 shrink-0" />
                        <span>{escrow.seller.slice(0, 6)}...</span>
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
                    <p className="font-bold text-sm tabular-nums text-right">
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
          })}
        </div>

        {/* Empty State */}
        {!isLoading && escrows.length === 0 && (
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
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-2" />
              Initialize First Escrow
            </Button>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {selectedEscrow && (
        <EscrowTransactionModal
          escrow={selectedEscrow}
          events={events}
          isMutating={isMutating}
          onLock={() => handleTransition("lock", selectedEscrow.id, selectedEscrow.buyer)}
          onRelease={() => handleTransition("release", selectedEscrow.id, selectedEscrow.buyer)}
          onRefund={() => handleTransition("refund", selectedEscrow.id, selectedEscrow.seller)}
          onClose={() => setSelectedEscrowId(null)}
        />
      )}
    </div>
  );
}
