"use client";

const USE_MOCK = true;

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

import {
  Loader2, Plus, ShieldCheck
} from "lucide-react";

import { toast } from "sonner";
import {
  useCreateEscrow as _useCreateEscrow,
  useEscrowEvents as _useEscrowEvents,
  useEscrows as _useEscrows,
  useLockEscrow as _useLockEscrow,
  useRefundEscrow as _useRefundEscrow,
  useReleaseEscrow as _useReleaseEscrow,
} from "@/hooks";

import { 
  EscrowState, EscrowRecord, EscrowEventRecord
} from "@/types/escrow";

import { EscrowTransactionModal, EscrowStatusBadge } from "@/components/EscrowTransactionModal";
//  Types 

let _mockStore: EscrowRecord[] = [
  {
    id: "esc-001-mock",
    buyer: "0x742d35Cc6634C0532925a3b844Bc454e7595f9aB8",
    seller: "0x9f3aD15A12e1F3514d8B8E9c6F16C2E8922A7cD2",
    amount: 250, tokenSymbol: "SDA", fixedFee: 5,
    description: "Website redesign milestone #1",
    state: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()

  },

  {
    id: "esc-002-mock",
    buyer: "0x742d35Cc6634C0532925a3b844Bc454e7595f9aB8",
    seller: "0xAbC12345678901234567890123456789012345aB",
    amount: 1200, tokenSymbol: "SDA", fixedFee: 20,
    description: "Smart contract audit — full scope",
    state: "locked",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },

  {
    id: "esc-003-mock",
    buyer: "0xDeF9876543210987654321098765432109876543",
    seller: "0x9f3aD15A12e1F3514d8B8E9c6F16C2E8922A7cD2",
    amount: 80, tokenSymbol: "SDA", fixedFee: 2,
    description: "Logo design package",
    state: "released",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },

  {

    id: "esc-004-mock",
    buyer: "0x742d35Cc6634C0532925a3b844Bc454e7595f9aB8",
    seller: "0xAbC12345678901234567890123456789012345aB",
    amount: 500, tokenSymbol: "SDA", fixedFee: 10,
    description: "API integration — cancelled",
    state: "refunded",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
];

const _mockEventStore: Record<string, EscrowEventRecord[]> = {
  "esc-001-mock": [
    { 
      id: "e1", 
      escrowId: "esc-001-mock", 
      type: "EscrowCreated", 
      state: "pending", 
      occurredAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() 
    },
  ],
  "esc-002-mock": [
    { 
      id: "e2", 
      escrowId: "esc-002-mock", 
      type: "EscrowCreated", 
      state: "pending", 
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() 
    },
    { 
      id: "e3", 
      escrowId: "esc-002-mock", 
      type: "TransactionLocked", 
      state: "locked", 
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() 
    },
  ],
  "esc-003-mock": [
    { 
      id: "e4", 
      escrowId: "esc-003-mock", 
      type: "EscrowCreated", 
      state: "pending", 
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() 
    },
    { 
      id: "e5", 
      escrowId: "esc-003-mock", 
      type: "TransactionLocked", 
      state: "locked", 
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() 
    },
    { 
      id: "e6", 
      escrowId: "esc-003-mock", 
      type: "FundsReleased", 
      state: "released", 
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() 
    },
  ],
  "esc-004-mock": [
    { 
      id: "e7", 
      escrowId: "esc-004-mock", 
      type: "EscrowCreated", 
      state: "pending", 
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() 
    },
    { 
      id: "e8", 
      escrowId: "esc-004-mock", 
      type: "FundsRefunded", 
      state: "refunded", 
      occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() 
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
  const refresh = useCallback((newId: string | null) =>
    setEvents(newId ? (_mockEventStore[newId] ?? []) : []), []);
  return { data: events, refresh };
}



function useMockCreateEscrow(refreshEscrows: () => void) {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = useCallback(async (payload: Omit<EscrowRecord, "id" | "state" | "createdAt">) => {
    setIsPending(true);
    await sleep(600);
    const newEscrow: EscrowRecord = { ...payload, id: `esc-${Date.now()}-mock`, state: "pending", createdAt: new Date().toISOString() };
    _mockStore = [newEscrow, ..._mockStore];
    _mockEventStore[newEscrow.id] = [{ id: `e-${Date.now()}`, escrowId: `esc-${Date.now()}-mock`, type: "EscrowCreated", state: "pending", occurredAt: new Date().toISOString() }];
    setIsPending(false);
    refreshEscrows();
    return { escrow: newEscrow };
  }, [refreshEscrows]);

  return { isPending, mutateAsync };

}


function useMockTransition(refreshEscrows: () => void, refreshEvents: (id: string | null) => void) {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback(async (action: "lock" | "release" | "refund", id: string) => {
    setIsPending(true);
    await sleep(600);
    const nextState: Record<string, EscrowState> = { lock: "locked", release: "released", refund: "refunded" };
    const evtType: Record<string, EscrowEventRecord["type"]> = {created: "EscrowCreated", lock: "TransactionLocked", release: "FundsReleased", refund: "FundsRefunded" };
    _mockStore = _mockStore.map((e) => e.id === id ? { ...e, state: nextState[action] } : e);
    _mockEventStore[id] = [...(_mockEventStore[id] ?? []), { id: `e-${Date.now()}`, escrowId: `esc-${Date.now()}-mock`, type: evtType[action], state: nextState[action], occurredAt: new Date().toISOString() }];
    setIsPending(false);
    refreshEscrows();
    refreshEvents(id);
  }, [refreshEscrows, refreshEvents]);

  return { isPending, mutate };
}


//  EscrowPage
const DEFAULT_BUYER = "0x742d35Cc6634C0532925a3b844Bc454e7595f9aB";
const DEFAULT_SELLER = "0x9f3aD15A12e1F3514d8B8E9c6F16C2E8922A7cD2";

const isValidAddress = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a);

export function EscrowPage() {

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEscrowId, setSelectedEscrowId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    buyer: DEFAULT_BUYER, seller: DEFAULT_SELLER, amount: "", token: "SDA", description: "", fixedFee: "0",
  });

  // Mock hooks (always constructed — hooks can't be conditional)
  const mockEscrows = useMockEscrows();
  const mockEvents = useMockEscrowEvents(selectedEscrowId);
  const mockCreate = useMockCreateEscrow(mockEscrows.refresh);
  const mockTransition = useMockTransition(mockEscrows.refresh, mockEvents.refresh);

  // Real hooks (always constructed, only used when USE_MOCK = false)
  const realEscrows = _useEscrows();
  const realEvents = _useEscrowEvents(USE_MOCK ? null : selectedEscrowId);
  const realCreate = _useCreateEscrow();
  const realLock = _useLockEscrow();
  const realRelease = _useReleaseEscrow();
  const realRefund = _useRefundEscrow();

  const escrows = USE_MOCK ? mockEscrows.data : (realEscrows.data ?? []);
  const events = USE_MOCK ? mockEvents.data : (realEvents.data ?? []);
  const isLoading = USE_MOCK ? false : realEscrows.isLoading;
  const error = USE_MOCK ? null : realEscrows.error;


  const selectedEscrow = selectedEscrowId ? escrows.find((e) => e.id === selectedEscrowId) ?? null : null;
  const totalLocked = escrows.filter((e) => e.state === "pending" || e.state === "locked").reduce((s, e) => s + e.amount, 0);
  const isMutating = USE_MOCK
    ? mockCreate.isPending || mockTransition.isPending
    : realCreate.isPending || realLock.isPending || realRelease.isPending || realRefund.isPending;

  const resetForm = () => setFormData({ buyer: DEFAULT_BUYER, seller: DEFAULT_SELLER, amount: "", token: "SDA", description: "", fixedFee: "0" });



  const handleCreateEscrow = async () => {
    if (!formData.buyer || !formData.seller || !formData.amount || !formData.description) {
      toast.error("Please fill in all required fields"); return;
    }

    if (!isValidAddress(formData.buyer)) { toast.error("Buyer wallet address is invalid (0x + 40 hex chars)"); return; }

    if (!isValidAddress(formData.seller)) { toast.error("Seller wallet address is invalid (0x + 40 hex chars)"); return; }


    const payload = { buyer: formData.buyer, seller: formData.seller, amount: Number(formData.amount), tokenSymbol: formData.token, description: formData.description, fixedFee: Number(formData.fixedFee || "0"), state: "pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

    try {

      const result = USE_MOCK ? await mockCreate.mutateAsync(payload) : await realCreate.mutateAsync(payload);
      toast.success("Escrow created");
      setSelectedEscrowId(result.escrow.id);
      setShowCreateDialog(false);
      resetForm();

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create escrow");
    }

  };

  const handleTransition = async (action: "lock" | "release" | "refund", id: string, actor: string) => {

    try {
      if (USE_MOCK) {
        await mockTransition.mutate(action, id);
      } else {
        if (action === "lock") await realLock.mutateAsync({ id, payload: { actor } });
        if (action === "release") await realRelease.mutateAsync({ id, payload: { actor } });
        if (action === "refund") await realRefund.mutateAsync({ id, payload: { actor } });
      }
      toast.success({ lock: "Escrow locked", release: "Funds released", refund: "Escrow refunded" }[action]);
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
              {USE_MOCK && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">Demo Mode</span>}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {escrows.length} records — {totalLocked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} units currently locked
            </p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" />New
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>New Escrow</DialogTitle>
                <DialogDescription>Funds will be held by the smart contract until all parties act.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">

                <div>
                  <Label htmlFor="buyer" className="text-sm">Buyer Wallet</Label>
                  <Input id="buyer" placeholder="0x..." value={formData.buyer} onChange={(e) => setFormData({ ...formData, buyer: e.target.value })} className="mt-1 bg-background border-border font-mono text-sm" />
                </div>

                <div>
                  <Label htmlFor="seller" className="text-sm">Seller Wallet</Label>
                  <Input id="seller" placeholder="0x..." value={formData.seller} onChange={(e) => setFormData({ ...formData, seller: e.target.value })} className="mt-1 bg-background border-border font-mono text-sm" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="amount" className="text-sm">Amount</Label>
                    <Input id="amount" type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="mt-1 bg-background border-border" />
                  </div>

                  <div>
                    <Label htmlFor="fixedFee" className="text-sm">Fixed Fee</Label>
                    <Input id="fixedFee" type="number" placeholder="0.00" value={formData.fixedFee} onChange={(e) => setFormData({ ...formData, fixedFee: e.target.value })} className="mt-1 bg-background border-border" />
                  </div>

                  <div>
                    <Label htmlFor="token" className="text-sm">Token</Label>
                    <Input id="token" value={formData.token} readOnly className="mt-1 bg-background border-border" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm">Transaction Description</Label>
                  <Textarea id="description" placeholder="Brief description..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-1 bg-background border-border min-h-20" />
                </div>

              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }} className="flex-1 border-border">Cancel</Button>
                <Button onClick={handleCreateEscrow} disabled={isMutating} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
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
              <Loader2 className="w-4 h-4 animate-spin" />Loading escrow records…
            </div>
          </Card>

        )}

        <div className="space-y-3">
          {escrows.map((escrow) => {
            const cfg = STATE_CONFIG[escrow.state as keyof typeof STATE_CONFIG];
            return (
              <Card key={escrow.id} onClick={() => setSelectedEscrowId(escrow.id)}
                className="p-4 bg-card border-border hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dotClass}`} />

                    <div className="min-w-0">
                      <p className="font-medium truncate">{escrow.description}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{escrow.buyer.slice(0, 8)}… → {escrow.seller.slice(0, 8)}…</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(escrow.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="font-semibold text-sm">{escrow.amount} <span className="text-xs text-muted-foreground font-normal">{escrow.tokenSymbol}</span></p>
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


      {/* Transaction modal */}
      {selectedEscrow && (
        <EscrowTransactionModal
          escrow={selectedEscrow} events={events} isMutating={isMutating}
          onLock={() => handleTransition("lock", selectedEscrow.id, selectedEscrow.buyer)}
          onRelease={() => handleTransition("release", selectedEscrow.id, selectedEscrow.buyer)}
          onRefund={() => handleTransition("refund", selectedEscrow.id, selectedEscrow.seller)}
          onClose={() => setSelectedEscrowId(null)}
        />
      )}
    </div>

  );

}