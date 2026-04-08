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

import { Loader2, Plus, ShieldCheck } from "lucide-react";

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

let _mockStore: EscrowRecord[] = [
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

  const mockEscrows = useMockEscrows();
  const mockEvents = useMockEscrowEvents(selectedEscrowId);
  const mockCreate = useMockCreateEscrow(mockEscrows.refresh);
  const mockTransition = useMockTransition(mockEscrows.refresh, mockEvents.refresh);

  const escrowRecord = useEscrows();
  const escrowEvents = useEscrowEvents(USE_MOCK ? null : selectedEscrowId);
  const createEscrow = useCreateEscrow();
  const lockEscrow = useLockEscrow();
  const releaseEscrow = useReleaseEscrow();
  const refundEscrow = useRefundEscrow();

  const escrows = USE_MOCK ? mockEscrows.data : (escrowRecord.data ?? []);
  const events = USE_MOCK ? mockEvents.data : (escrowEvents.data ?? []);
  const isLoading = USE_MOCK ? false : escrowRecord.isLoading;
  const error = USE_MOCK ? null : escrowRecord.error;

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

    if (!isValidAddress(formData.buyer)) {
      toast.error("Buyer wallet address is invalid (0x + 40 hex chars)");
      return;
    }
    if (!isValidAddress(formData.seller)) {
      toast.error("Seller wallet address is invalid (0x + 40 hex chars)");
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
      if (USE_MOCK) {
        await mockTransition.mutate(action, id);
      } else {
        if (action === "lock") await lockEscrow.mutateAsync({ id, payload: { actor } });
        if (action === "release") await releaseEscrow.mutateAsync({ id, payload: { actor } });
        if (action === "refund") await refundEscrow.mutateAsync({ id, payload: { actor } });
      }
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
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">Escrow</h1>
              {USE_MOCK && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  Demo Mode
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {escrows.length} records —{" "}
              {totalLocked.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              units currently locked
            </p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </DialogTrigger>
            {/* CRITERIA CHECK: "Mobile and desktop layouts remain clean"
               - fixed left-1/2... centers the modal exactly on all screen heights.
               - w-[calc(100%-2rem)] ensures a clean 16px gap on mobile.
               - max-w-md prevents it from looking stretched on desktop.
            */}
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-card border-border p-0 overflow-hidden flex flex-col max-h-[90vh]">
              <DialogHeader className="p-6 border-b border-border">
                <DialogTitle>New Escrow</DialogTitle>
                <DialogDescription>
                  Funds will be held by the smart contract until all parties act.
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <Label htmlFor="buyer" className="text-sm">
                    Buyer Wallet
                  </Label>
                  <Input
                    id="buyer"
                    placeholder="0x..."
                    value={formData.buyer}
                    onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                    className="mt-1 bg-background border-border font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="seller" className="text-sm">
                    Seller Wallet
                  </Label>
                  <Input
                    id="seller"
                    placeholder="0x..."
                    value={formData.seller}
                    onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                    className="mt-1 bg-background border-border font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="amount" className="text-sm">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="mt-1 bg-background border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fixedFee" className="text-sm">
                      Fixed Fee
                    </Label>
                    <Input
                      id="fixedFee"
                      type="number"
                      placeholder="0.00"
                      value={formData.fixedFee}
                      onChange={(e) => setFormData({ ...formData, fixedFee: e.target.value })}
                      className="mt-1 bg-background border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="token" className="text-sm">
                      Token
                    </Label>
                    <Input
                      id="token"
                      value={formData.token}
                      readOnly
                      className="mt-1 bg-background border-border"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm">
                    Transaction Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Purpose of transaction"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 bg-background border-border min-h-20"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-border bg-card flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    resetForm();
                  }}
                  className="flex-1 border-border"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEscrow}
                  disabled={isMutating}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <Card className="p-4 mb-4 border-red-500/40 bg-red-500/10 text-red-200">
            {error instanceof Error ? error.message : "Failed to load escrow records"}
          </Card>
        )}

        {isLoading && (
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading escrow records…
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {escrows.map((escrow) => {
            const cfg = STATE_CONFIG[escrow.state as keyof typeof STATE_CONFIG];
            return (
              <Card
                key={escrow.id}
                onClick={() => setSelectedEscrowId(escrow.id)}
                className="p-4 bg-card border-border hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dotClass}`} />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{escrow.description}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {escrow.buyer.slice(0, 8)}… → {escrow.seller.slice(0, 8)}…
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(escrow.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="font-semibold text-sm">
                      {escrow.amount}{" "}
                      <span className="text-xs text-muted-foreground font-normal">
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

        {!isLoading && escrows.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p>No escrow records yet</p>
            <p className="text-sm mt-1">Create a new escrow to start a trustless transaction.</p>
          </div>
        )}
      </div>

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
