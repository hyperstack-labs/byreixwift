"use client";

import { useState } from "react";
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
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateEscrow,
  useEscrowEvents,
  useEscrows,
  useLockEscrow,
  useRefundEscrow,
  useReleaseEscrow,
} from "@/hooks";

const DEFAULT_BUYER = "0x742d35Cc6634C0532925a3b844Bc9e7595f9aB8";
const DEFAULT_SELLER = "0x9f3aD15A12e1F3514d8B8E9c6F16C2E8922A7cD2";

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

  const { data: escrows = [], isLoading, error } = useEscrows();
  const { data: events = [] } = useEscrowEvents(selectedEscrowId);
  const createEscrow = useCreateEscrow();
  const lockEscrow = useLockEscrow();
  const releaseEscrow = useReleaseEscrow();
  const refundEscrow = useRefundEscrow();

  const totalLocked = escrows
    .filter((escrow) => escrow.state === "pending" || escrow.state === "locked")
    .reduce((sum, escrow) => sum + escrow.amount, 0);

  const isMutating =
    createEscrow.isPending ||
    lockEscrow.isPending ||
    releaseEscrow.isPending ||
    refundEscrow.isPending;

  const resetForm = () => {
    setFormData({
      buyer: DEFAULT_BUYER,
      seller: DEFAULT_SELLER,
      amount: "",
      token: "SDA",
      description: "",
      fixedFee: "0",
    });
  };

  const handleCreateEscrow = async () => {
    if (!formData.buyer || !formData.seller || !formData.amount || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const result = await createEscrow.mutateAsync({
        buyer: formData.buyer,
        seller: formData.seller,
        amount: Number(formData.amount),
        tokenSymbol: formData.token,
        description: formData.description,
        fixedFee: Number(formData.fixedFee || "0"),
      });

      toast.success("Escrow created");
      setSelectedEscrowId(result.escrow.id);
      setShowCreateDialog(false);
      resetForm();
    } catch (mutationError) {
      toast.error(mutationError instanceof Error ? mutationError.message : "Failed to create escrow");
    }
  };

  const handleTransition = async (
    action: "lock" | "release" | "refund",
    id: string,
    actor: string
  ) => {
    try {
      if (action === "lock") {
        await lockEscrow.mutateAsync({ id, payload: { actor } });
        toast.success("Escrow locked");
      } else if (action === "release") {
        await releaseEscrow.mutateAsync({ id, payload: { actor } });
        toast.success("Funds released");
      } else {
        await refundEscrow.mutateAsync({ id, payload: { actor } });
        toast.success("Escrow refunded");
      }

      setSelectedEscrowId(id);
    } catch (mutationError) {
      toast.error(
        mutationError instanceof Error ? mutationError.message : "Failed to update escrow"
      );
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Escrow</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {escrows.length} records - {totalLocked.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              units locked in the current mock lifecycle
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>New Escrow</DialogTitle>
                <DialogDescription>
                  Clean v0 lifecycle: pending, locked, released, refunded.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="buyer" className="text-sm">
                    Buyer Wallet
                  </Label>
                  <Input
                    id="buyer"
                    placeholder="0x..."
                    value={formData.buyer}
                    onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                    className="mt-1 bg-background border-border"
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
                    className="mt-1 bg-background border-border"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    placeholder="Brief description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 bg-background border-border min-h-20"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
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
                  {createEscrow.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {isLoading && (
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading escrow records...
                </div>
              </Card>
            )}

            {escrows.map((escrow) => (
              <Card
                key={escrow.id}
                className="p-4 bg-card border-border hover:border-border/50 transition-colors"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        escrow.state === "locked"
                          ? "bg-(--byreix-gold)"
                          : escrow.state === "pending"
                            ? "bg-yellow-500"
                            : "bg-primary"
                      }`}
                    />

                    <div className="min-w-0">
                      <p className="font-medium truncate">{escrow.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {escrow.buyer.slice(0, 8)}...
                        {" -> "}
                        {escrow.seller.slice(0, 8)}...
                        {" | "}
                        {new Date(escrow.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="rounded-xl border border-border bg-background/40 p-3">
                      <p className="text-muted-foreground text-xs mb-1">Amount</p>
                      <p className="font-medium">
                        {escrow.amount} {escrow.tokenSymbol}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/40 p-3">
                      <p className="text-muted-foreground text-xs mb-1">Fixed Fee</p>
                      <p className="font-medium">{escrow.fixedFee}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/40 p-3">
                      <p className="text-muted-foreground text-xs mb-1">State</p>
                      <p className="font-medium capitalize">{escrow.state}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/40 p-3">
                      <p className="text-muted-foreground text-xs mb-1">Escrow ID</p>
                      <p className="font-medium">{escrow.id.slice(0, 8)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedEscrowId(escrow.id)}
                      className="border-border hover:bg-secondary"
                    >
                      View Events
                    </Button>
                    {escrow.state === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isMutating}
                        onClick={() => handleTransition("lock", escrow.id, escrow.buyer)}
                        className="border-border hover:bg-secondary"
                      >
                        Lock
                      </Button>
                    )}
                    {escrow.state === "locked" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isMutating}
                        onClick={() => handleTransition("release", escrow.id, escrow.buyer)}
                        className="border-border hover:bg-secondary"
                      >
                        Release
                      </Button>
                    )}
                    {(escrow.state === "pending" || escrow.state === "locked") && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isMutating}
                        onClick={() => handleTransition("refund", escrow.id, escrow.seller)}
                        className="border-border hover:bg-secondary"
                      >
                        Refund
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-5 bg-card border-border h-fit">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Escrow Events</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Backend lifecycle hooks for the selected escrow record.
              </p>
            </div>

            {!selectedEscrowId && (
              <p className="text-sm text-muted-foreground">
                Select an escrow record to inspect its created, locked, released, or refunded events.
              </p>
            )}

            {selectedEscrowId && events.length === 0 && (
              <p className="text-sm text-muted-foreground">No events recorded yet.</p>
            )}

            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-border bg-background/40 p-3"
                >
                  <p className="font-medium">{event.type}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    State: {event.state}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(event.occurredAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {!isLoading && escrows.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No escrow records yet</p>
            <p className="text-sm mt-1">Create a mock escrow to test the full lifecycle.</p>
          </div>
        )}
      </div>
    </div>
  );
}

