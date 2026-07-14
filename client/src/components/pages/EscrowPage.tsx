"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount, useWriteContract, usePublicClient } from "wagmi";
import { parseEther, parseEventLogs, keccak256, toHex } from "viem";
import { getContractEscrow } from "@/lib/contract";
import { ESCROW_ABI, ESCROW_CONTRACT_ADDRESS } from "@/config/contract";
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
} from "@/components/ui";
import {
  Loader2,
  Plus,
  Inbox,
  Wallet,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCreateEscrow,
  useEscrowEvents,
  useEscrows,
  useLockEscrow,
  useReleaseEscrow,
  useRefundEscrow,
} from "@/hooks";
import { EscrowRecord } from "@/types/escrow";
import {
  EscrowTransactionModal,
  EscrowStatusBadge,
  STATE_CONFIG,
} from "@/components/EscrowTransactionModal";

const isValidAddress = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a);

const cleanEscrowDescription = (e: EscrowRecord): EscrowRecord => ({
  ...e,
  description: e.description.replace(/^\[OnChainId:\s*\d+\]\s*/, ""),
});

export function EscrowPage() {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const [mode, setMode] = useState<"simulation" | "live">("simulation"); // For toggling between simulation and live modes
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creationSuccessData, setCreationSuccessData] = useState<EscrowRecord | null>(null);
  const [selectedEscrowId, setSelectedEscrowId] = useState<string | null>(null);
  const [contractEscrow, setContractEscrow] = useState<(string | number | boolean)[] | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    seller: "",
    amount: "",
    token: "SDA",
    description: "",
    fixedFee: "0",
  });
  const [isPendingOnChain, setIsPendingOnChain] = useState(false);
  const [prevSelectedId, setPrevSelectedId] = useState<string | null>(null);
  const [prevMode, setPrevMode] = useState<"simulation" | "live">("simulation");

  if (selectedEscrowId !== prevSelectedId || mode !== prevMode) {
    setPrevSelectedId(selectedEscrowId);
    setPrevMode(mode);
    setContractEscrow(null);
  }

  // Real hooks connected to the /api/escrows endpoints
  const { data: escrows = [], isLoading, error } = useEscrows();
  const { data: events = [] } = useEscrowEvents(selectedEscrowId);

  // Mutation hooks for state transitions
  const createEscrow = useCreateEscrow();
  const lockEscrow = useLockEscrow();
  const releaseEscrow = useReleaseEscrow();
  const refundEscrow = useRefundEscrow();

  // Reset logic updating both fields cleanly on command
  const resetForm = useCallback(() => {
    setFormData({
      seller: "",
      amount: "",
      token: "SDA",
      description: "",
      fixedFee: "0",
    });
    setFormErrors({});
    setCreationSuccessData(null);
  }, []);

  // Memoized selection of the current escrow object from the list
  const selectedEscrow = selectedEscrowId
    ? (escrows.find((e) => e.id === selectedEscrowId) ?? null)
    : null;

  const cleanedSelectedEscrow = selectedEscrow ? cleanEscrowDescription(selectedEscrow) : null;

  useEffect(() => {
    if (mode !== "live" || !selectedEscrow) {
      return;
    }

    const match = selectedEscrow.description.match(/^\[OnChainId:\s*(\d+)\]/);
    const onChainId = match ? match[1] : "0";

    getContractEscrow(onChainId).then(setContractEscrow).catch(console.error);
  }, [mode, selectedEscrow]);

  // Aggregate calculation for header stats
  const totalLocked = escrows
    .filter((e) => e.state === "pending" || e.state === "locked")
    .reduce((s, e) => s + e.amount, 0);

  // Combined mutation state for UI disabling during active requests
  const isMutating =
    createEscrow.isPending ||
    lockEscrow.isPending ||
    releaseEscrow.isPending ||
    refundEscrow.isPending ||
    isPendingOnChain;

  // Field validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!connectedAddress) errors.buyer = "No wallet connected";
    else if (!isValidAddress(connectedAddress)) errors.buyer = "Invalid address";
    if (!formData.seller) errors.seller = "Required";
    else if (!isValidAddress(formData.seller)) errors.seller = "Invalid address";
    if (!formData.amount || Number(formData.amount) <= 0) errors.amount = "Invalid";
    if (!formData.description) errors.description = "Required";
    if (!formData.token) errors.token = "Required";
    if (formData.fixedFee === "" || Number(formData.fixedFee) < 0) errors.fixedFee = "Invalid";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateEscrow = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    if (mode === "live") {
      if (!connectedAddress) {
        toast.error("Please connect your wallet first");
        return;
      }
      if (!publicClient) {
        toast.error("Blockchain provider is not ready. Please check your connection.");
        return;
      }

      setIsPendingOnChain(true);
      setModalError(null);
      try {
        const grossAmountValue = parseEther(formData.amount) + parseEther(formData.fixedFee || "0");
        const agreementHash = keccak256(toHex(formData.description || ""));

        // Call the write contract method
        const hash = await writeContractAsync({
          address: ESCROW_CONTRACT_ADDRESS,
          abi: ESCROW_ABI,
          functionName: "deposit",
          args: [formData.seller as `0x${string}`, agreementHash],
          value: grossAmountValue,
        });

        toast.info("Transaction submitted on-chain. Waiting for confirmation...", {
          description: `Tx Hash: ${hash.slice(0, 8)}...${hash.slice(-6)}`,
        });

        // Wait for confirmation
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        // Parse logs to find transaction ID
        const logs = parseEventLogs({
          abi: ESCROW_ABI,
          eventName: "EscrowCreated",
          logs: receipt.logs,
        });

        const onChainTxId = logs[0]?.args?.txId?.toString();
        if (!onChainTxId) {
          throw new Error("Could not find EscrowCreated event in transaction receipt.");
        }

        toast.success(`Transaction confirmed on-chain! ID: ${onChainTxId}`);

        // Prefix description to persist the onChainTxId in the PostgreSQL database without changing schema
        const prefixedDescription = `[OnChainId: ${onChainTxId}] ${formData.description}`;

        const payload = {
          buyer: connectedAddress.toLowerCase(),
          seller: formData.seller.toLowerCase(),
          amount: Number(formData.amount),
          tokenSymbol: formData.token,
          description: prefixedDescription,
          fixedFee: Number(formData.fixedFee || "0"),
          txHash: hash,
        };

        const result = await createEscrow.mutateAsync(payload);
        toast.success("Escrow recorded in database successfully");
        setCreationSuccessData(result?.escrow || (result as unknown as EscrowRecord));
        resetForm();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to execute transaction";
        toast.error(msg);
        setModalError(msg);
      } finally {
        setIsPendingOnChain(false);
      }
      return;
    }

    const payload = {
      buyer: connectedAddress as string, // Buyer is read directly from connectedAddress
      seller: formData.seller,
      amount: Number(formData.amount),
      tokenSymbol: formData.token,
      description: formData.description,
      fixedFee: Number(formData.fixedFee || "0"),
    };

    try {
      const result = await createEscrow.mutateAsync(payload);
      toast.success("Escrow created successfully");
      // Read wrapped object based on NestJS controller response payload mapping
      setCreationSuccessData(result?.escrow || (result as unknown as EscrowRecord));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create escrow");
    }
  };

  const handleTransition = async (
    action: "lock" | "release" | "refund",
    id: string,
    actor: string
  ) => {
    // Clear any prior error before attempting the transition
    setModalError(null);

    if (mode === "live") {
      if (!connectedAddress) {
        toast.error("Please connect your wallet first");
        return;
      }
      if (!selectedEscrow) {
        toast.error("No escrow selected");
        return;
      }
      if (!publicClient) {
        toast.error("Blockchain provider is not ready");
        return;
      }

      setIsPendingOnChain(true);
      try {
        const match = selectedEscrow.description.match(/^\[OnChainId:\s*(\d+)\]/);
        const onChainId = match ? BigInt(match[1]) : BigInt(0);

        // Call the write contract method
        const hash = await writeContractAsync({
          address: ESCROW_CONTRACT_ADDRESS,
          abi: ESCROW_ABI,
          functionName: action,
          args: [onChainId],
        });

        toast.info(`Transaction submitted: ${action}. Waiting for confirmation...`, {
          description: `Tx Hash: ${hash.slice(0, 8)}...${hash.slice(-6)}`,
        });

        // Wait for confirmation
        await publicClient.waitForTransactionReceipt({ hash });
        toast.success(`Transaction confirmed on-chain! Syncing state with database...`);

        // Record on backend REST API to sync the DB status
        if (action === "lock") await lockEscrow.mutateAsync({ id, payload: { actor, txHash: hash } });
        if (action === "release") await releaseEscrow.mutateAsync({ id, payload: { actor, txHash: hash } });
        if (action === "refund") await refundEscrow.mutateAsync({ id, payload: { actor, txHash: hash } });

        toast.success(
          {
            lock: "Escrow locked successfully",
            release: "Funds released successfully",
            refund: "Escrow refunded successfully",
          }[action]
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to execute transaction";
        toast.error(message);
        setModalError(message);
      } finally {
        setIsPendingOnChain(false);
      }
      return;
    }

    try {
      if (action === "lock") await lockEscrow.mutateAsync({ id, payload: { actor } });
      if (action === "release") await releaseEscrow.mutateAsync({ id, payload: { actor } });
      if (action === "refund") await refundEscrow.mutateAsync({ id, payload: { actor } });
      // Action Feedback
      toast.success(
        {
          lock: "Escrow locked successfully",
          release: "Funds released successfully",
          refund: "Escrow refunded successfully",
        }[action]
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update escrow";
      toast.error(message);
      setModalError(message);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-foreground">Escrow</h1>
            </div>
            <div className="min-h-6">
              {!isLoading ? (
                <p className="text-sm text-muted-foreground animate-in fade-in duration-500">
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

          <Dialog
            open={showCreateDialog}
            onOpenChange={(open) => {
              // Prevent modal cancellation while network calls are processing
              if (isMutating) return;
              setShowCreateDialog(open);
              if (!open) {
                setTimeout(resetForm, 300);
              }
            }}
          >
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
                        onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                        className={`bg-background font-mono text-sm transition-colors ${
                          formErrors.seller
                            ? "border-red-500 ring-1 ring-red-500/20"
                            : "border-border"
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
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className={`bg-background transition-colors ${
                            formErrors.amount
                              ? "border-red-500 ring-1 ring-red-500/20"
                              : "border-border"
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
                          onChange={(e) => setFormData({ ...formData, fixedFee: e.target.value })}
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
                          onChange={(e) => setFormData({ ...formData, token: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      onClick={() => {
                        setShowCreateDialog(false);
                        setTimeout(resetForm, 300);
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
                    Escrow{" "}
                    <span className="font-mono text-foreground">{creationSuccessData.id}</span> has
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
                      onClick={() => {
                        const id = creationSuccessData.id;
                        setShowCreateDialog(false);
                        setTimeout(() => {
                          setSelectedEscrowId(id);
                          resetForm();
                        }, 100);
                      }}
                    >
                      View Details
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => {
                        setShowCreateDialog(false);
                        setTimeout(resetForm, 300);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Error State */}
        {error && (
          <Card className="p-4 mb-4 border-red-500/40 bg-red-500/10 text-red-200 text-left">
            {error instanceof Error ? error.message : "Failed to load escrow records"}
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3" aria-hidden="true">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 w-full rounded-xl border border-border bg-card/50 flex items-center px-4 justify-between animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-muted rounded" />
                    <div className="h-3 w-32 bg-muted/60 rounded" />
                  </div>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-5 w-20 bg-muted/40 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Pipelines Grid */}
        <div className="space-y-3">
          {!isLoading &&
            escrows.map((escrow) => {
              // Safe casing translation to prevent lookups from returning undefined configurations
              const lookupKey = escrow.state?.toUpperCase() as keyof typeof STATE_CONFIG;
              const cfg = STATE_CONFIG[lookupKey] || { dotClass: "bg-muted" };
              const cleanedEscrow = cleanEscrowDescription(escrow);

              return (
                <Card
                  key={escrow.id}
                  onClick={() => !isMutating && setSelectedEscrowId(escrow.id)}
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
      {selectedEscrow && cleanedSelectedEscrow && (
        <EscrowTransactionModal
          escrow={cleanedSelectedEscrow}
          events={events}
          isMutating={isMutating}
          contractEscrow={contractEscrow}
          error={modalError}
          mode={mode} // Pass the current mode to the modal
          onLock={() => handleTransition("lock", selectedEscrow.id, selectedEscrow.buyer)}
          onRelease={() => handleTransition("release", selectedEscrow.id, selectedEscrow.buyer)}
          onRefund={() => handleTransition("refund", selectedEscrow.id, selectedEscrow.seller)}
          onClose={() => {
            // Prevent closing modal during active background updates
            if (isMutating) return;
            setSelectedEscrowId(null);
            setModalError(null);
          }}
        />
      )}
    </div>
  );
}
