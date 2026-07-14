"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount, useWriteContract, usePublicClient } from "wagmi";
import { parseEther, parseEventLogs, keccak256, toHex } from "viem";
import { getContractEscrow } from "@/lib/contract";
import { ESCROW_ABI, ESCROW_CONTRACT_ADDRESS } from "@/config/contract";
import { Card } from "@/components/ui";
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
import { EscrowTransactionModal } from "@/components/EscrowTransactionModal";
import { CreateEscrowDialog } from "@/components/escrow/CreateEscrowDialog";
import { EscrowCard } from "@/components/escrow/EscrowCard";
import { EscrowEmptyState } from "@/components/escrow/EscrowEmptyState";

const isValidAddress = (a: string) => /^0x[0-9a-fA-F]{40}$/.test(a);

const cleanEscrowDescription = (e: EscrowRecord): EscrowRecord => ({
  ...e,
  description: e.description.replace(/^\[OnChainId:\s*\d+\]\s*/, ""),
});

export function EscrowPage() {
  const { address: connectedAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const [mode, setMode] = useState<"simulation" | "live">("simulation");
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

    const onChainId =
      selectedEscrow.onChainId !== undefined && selectedEscrow.onChainId !== null
        ? selectedEscrow.onChainId.toString()
        : (selectedEscrow.description.match(/^\[OnChainId:\s*(\d+)\]/)?.[1] ?? "0");

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

        const payload = {
          buyer: connectedAddress.toLowerCase(),
          seller: formData.seller.toLowerCase(),
          amount: Number(formData.amount),
          tokenSymbol: formData.token,
          description: formData.description,
          fixedFee: Number(formData.fixedFee || "0"),
          txHash: hash,
          onChainId: Number(onChainTxId),
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
      buyer: connectedAddress as string,
      seller: formData.seller,
      amount: Number(formData.amount),
      tokenSymbol: formData.token,
      description: formData.description,
      fixedFee: Number(formData.fixedFee || "0"),
    };

    try {
      const result = await createEscrow.mutateAsync(payload);
      toast.success("Escrow created successfully");
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
        const rawOnChainId =
          selectedEscrow.onChainId !== undefined && selectedEscrow.onChainId !== null
            ? selectedEscrow.onChainId
            : selectedEscrow.description.match(/^\[OnChainId:\s*(\d+)\]/)?.[1]
              ? parseInt(selectedEscrow.description.match(/^\[OnChainId:\s*(\d+)\]/)![1], 10)
              : 0;
        const onChainId = BigInt(rawOnChainId);

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
        if (action === "lock")
          await lockEscrow.mutateAsync({ id, payload: { actor, txHash: hash } });
        if (action === "release")
          await releaseEscrow.mutateAsync({ id, payload: { actor, txHash: hash } });
        if (action === "refund")
          await refundEscrow.mutateAsync({ id, payload: { actor, txHash: hash } });

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

          <CreateEscrowDialog
            open={showCreateDialog}
            onOpenChange={(open) => {
              if (isMutating) return;
              setShowCreateDialog(open);
              if (!open) {
                setTimeout(resetForm, 300);
              }
            }}
            isMutating={isMutating}
            connectedAddress={connectedAddress}
            formData={formData}
            onChangeFormData={setFormData}
            formErrors={formErrors}
            onCreate={handleCreateEscrow}
            creationSuccessData={creationSuccessData}
            onViewDetails={(id) => {
              setShowCreateDialog(false);
              setTimeout(() => {
                setSelectedEscrowId(id);
                resetForm();
              }, 100);
            }}
            onClose={() => {
              setShowCreateDialog(false);
              setTimeout(resetForm, 300);
            }}
            mode={mode}
            setMode={setMode}
          />
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
            escrows.map((escrow) => (
              <EscrowCard
                key={escrow.id}
                escrow={escrow}
                isMutating={isMutating}
                onSelect={setSelectedEscrowId}
                cleanEscrowDescription={cleanEscrowDescription}
              />
            ))}
        </div>

        {/* Empty State */}
        {!isLoading && escrows.length === 0 && (
          <EscrowEmptyState onInitialize={() => setShowCreateDialog(true)} />
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
          mode={mode}
          onLock={() => handleTransition("lock", selectedEscrow.id, selectedEscrow.buyer)}
          onRelease={() => handleTransition("release", selectedEscrow.id, selectedEscrow.buyer)}
          onRefund={() => handleTransition("refund", selectedEscrow.id, selectedEscrow.seller)}
          onClose={() => {
            if (isMutating) return;
            setSelectedEscrowId(null);
            setModalError(null);
          }}
        />
      )}
    </div>
  );
}
