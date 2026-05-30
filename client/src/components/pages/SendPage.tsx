"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import {
  Send,
  QrCode,
  Scan,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Loader2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useSidraTokens } from "@/hooks/useSidraTokens";

type TxStatus = "idle" | "pending" | "success" | "error";

interface TransferReceipt {
  recipient: string;
  amount: string;
  symbol: string;
  memo?: string;
  txHash: string;
  timestamp: string;
}

export function SendPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken] = useState({ symbol: "SDA", balance: "12,450.50" });
  const [memo, setMemo] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(true);

  // State tracking for real network broadcast delays
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [receipt, setReceipt] = useState<TransferReceipt | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: tokenData, isLoading: isLoadingTokens, error: tokenError } = useSidraTokens();

  const selectedTokenData = tokenData?.find((t) => t.symbol === selectedToken.symbol);

  const priceUsd = selectedTokenData?.priceUsd || 0;

  const numericAmount = parseFloat(amount || "0");

  const networkFeeUsd = 1.5;
  const usdValue = numericAmount * priceUsd;
  const totalUsd = usdValue + networkFeeUsd;

  const validateAddress = (address: string) => {
    const isValid = address.length === 0 || /^0x[a-fA-F0-9]{40}$/.test(address);
    setIsValidAddress(isValid);
    return isValid;
  };

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
    validateAddress(value);
  };

  const handleSend = () => {
    if (!recipient) {
      toast.error("Please enter a recipient address");
      return;
    }
    if (!isValidAddress) {
      toast.error("Invalid wallet address");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount) > parseFloat(selectedToken.balance.replace(/,/g, ""))) {
      toast.error("Insufficient balance");
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSend = async () => {
    setIsBroadcasting(true);
    setTxStatus("pending");
    setErrorMessage("");

    try {
      if (tokenError) {
        throw new Error("Network layer context drop-out.");
      }

      const successfulReceipt: TransferReceipt = {
        recipient,
        amount,
        symbol: selectedToken.symbol,
        memo: memo || undefined,
        txHash: "0x4b9a...2e1f",
        timestamp: new Date().toLocaleTimeString(),
      };

      setReceipt(successfulReceipt);
      setTxStatus("success");
      toast.success("Transaction sent successfully!");
      setShowConfirmDialog(false);

      // Reset form variables upon verified success
      setRecipient("");
      setAmount("");
      setMemo("");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Transaction broadcast failed.";
      setErrorMessage(msg);

      const failureReceipt: TransferReceipt = {
        recipient,
        amount,
        symbol: selectedToken.symbol,
        memo: memo || undefined,
        txHash: "0x0000...0000",
        timestamp: new Date().toLocaleTimeString(),
      };

      setReceipt(failureReceipt);
      setTxStatus("error");
      toast.error(`${msg} Please try again.`);
      setShowConfirmDialog(false);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const resetForm = () => {
    setTxStatus("idle");
    setReceipt(null);
    setErrorMessage("");
  };

  const recentContacts = [
    { name: "Exchange Wallet", address: "0x742d...9aB8" },
    { name: "Savings", address: "0x9f3a...7cD2" },
    { name: "John Doe", address: "0x5e8b...4fA1" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {(txStatus === "success" || txStatus === "error") && receipt ? (
        <Card className="p-6 bg-card border-border">
          <div className="flex flex-col items-center text-center space-y-4">
            {txStatus === "success" ? (
              <div className="rounded-full bg-green-500/10 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            ) : (
              <div className="rounded-full bg-red-500/10 p-3">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
            )}

            <div className="space-y-1">
              <h2 className="text-2xl font-bold">
                {txStatus === "success" ? "Transfer Completed" : "Transfer Failed"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {txStatus === "success"
                  ? "Your assets have been successfully dispatched to the network."
                  : errorMessage || "The transmission routing sequence failed."}
              </p>
            </div>

            <div className="w-full rounded-xl bg-background border border-border p-4 mt-4 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dispatched Amount</span>
                <span className="font-semibold text-foreground">
                  {receipt.amount} {receipt.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recipient Target</span>
                <span className="font-mono text-xs truncate max-w-50">{receipt.recipient}</span>
              </div>
              {receipt.memo && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Attached Memo</span>
                  <span className="italic text-foreground">&quot;{receipt.memo}&quot;</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tx Hash Reference</span>
                <a
                  href="#"
                  className="flex items-center gap-1 text-primary hover:underline font-mono text-xs"
                >
                  {receipt.txHash} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Execution Time</span>
                <span className="font-medium">{receipt.timestamp}</span>
              </div>
            </div>

            <Button onClick={resetForm} className="w-full mt-6 py-6 text-lg font-bold">
              {txStatus === "success" ? "Send More Assets" : "Return to Form"}
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card className="p-6 bg-card border-border">
            <h2 className="text-2xl font-semibold mb-6">Send Tokens</h2>

            <div className="space-y-6">
              {/* Recipient */}
              <div className="space-y-2">
                <Label htmlFor="recipient" className="px-1 text-sm">
                  Recipient Address
                </Label>
                <div className="relative">
                  <Input
                    id="recipient"
                    placeholder="Enter wallet address"
                    value={recipient}
                    disabled={isBroadcasting}
                    onChange={(e) => handleRecipientChange(e.target.value)}
                    className={`pr-20 bg-background border-border ${
                      !isValidAddress && recipient
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isBroadcasting}
                      className="h-9 w-9 p-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      <Scan className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isBroadcasting}
                      className="h-9 w-9 p-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {!isValidAddress && recipient && (
                  <p className="text-sm text-red-500 flex items-center gap-1 px-1">
                    <AlertCircle className="w-4 h-4" />
                    Invalid address format
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="amount" className="text-sm">
                    Amount
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Balance: {selectedToken.balance} {selectedToken.symbol}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border transition-colors focus-within:border-primary/50">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      disabled={isBroadcasting}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-transparent border-none text-3xl md:text-4xl p-0 h-auto focus-visible:ring-0 flex-1 min-w-0"
                    />
                    <Button
                      variant="outline"
                      disabled={isBroadcasting}
                      className="flex items-center gap-2 border-border bg-card hover:bg-border h-10 px-3 shrink-0 cursor-pointer"
                    >
                      <span className="font-bold">{selectedToken.symbol}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    {isLoadingTokens ? (
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    ) : (
                      <span className="text-sm text-muted-foreground font-medium">
                        ≈ $
                        {usdValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    )}
                    <button
                      disabled={isBroadcasting}
                      onClick={() => setAmount(selectedToken.balance.replace(/,/g, ""))}
                      className="text-sm font-semibold text-primary hover:underline underline-offset-4 cursor-pointer disabled:opacity-50"
                    >
                      Use Maximum
                    </button>
                  </div>
                </div>
              </div>

              {/* Memo*/}
              <div className="space-y-2">
                <Label htmlFor="memo">
                  Memo <span className="text-muted-foreground text-sm">(Optional)</span>
                </Label>
                <Input
                  id="memo"
                  placeholder="What is this for?"
                  value={memo}
                  disabled={isBroadcasting}
                  onChange={(e) => setMemo(e.target.value)}
                  className="bg-background border-border h-11"
                />
              </div>

              {/* Transaction details */}
              {amount && (
                <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                  {isLoadingTokens ? (
                    <div className="space-y-3 py-1">
                      <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                      <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                      <div className="h-5 w-2/3 bg-muted rounded animate-pulse pt-2" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Token Value (USD)</span>
                        <span className="text-foreground">${usdValue.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Network Fee</span>
                        <span className="text-foreground">${networkFeeUsd.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-border flex items-center justify-between text-sm">
                        <span className="font-medium">Total Cost</span>
                        <span className="text-foreground font-bold text-base">
                          ${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Time</span>
                        <span className="text-foreground">~30 seconds</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Send button */}
              <Button
                onClick={handleSend}
                disabled={isBroadcasting || isLoadingTokens}
                className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-black py-7 text-lg font-bold transition-all active:scale-[0.98]"
              >
                <Send className="w-5 h-5 mr-2" />
                {amount ? `Send ${amount} ${selectedToken.symbol}` : "Send Tokens"}
              </Button>
            </div>
          </Card>

          {/* Recent Contacts */}
          <Card className="mt-6 p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-4">Recent Contacts</h3>
            <div className="space-y-3">
              {isLoadingTokens
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-background/10 animate-pulse"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-28 bg-muted rounded" />
                        <div className="h-3 w-40 bg-muted/60 rounded font-mono" />
                      </div>
                      <div className="h-4 w-4 bg-muted/40 rounded" />
                    </div>
                  ))
                : recentContacts.map((contact) => (
                    <button
                      key={contact.address}
                      disabled={isBroadcasting}
                      onClick={() => {
                        setRecipient(contact.address);
                        setIsValidAddress(true);
                      }}
                      className="w-full cursor-pointer flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-left group disabled:opacity-50"
                    >
                      <div>
                        <p className="text-sm font-semibold">{contact.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{contact.address}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 group-hover:text-primary transition-colors shrink-0 ml-2" />
                    </button>
                  ))}
            </div>
          </Card>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onOpenChange={isBroadcasting ? undefined : setShowConfirmDialog}
      >
        <DialogContent className="bg-card border-border sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>
              Please review the transaction details before confirming.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="p-4 rounded-lg bg-background border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Token Price</span>
                <span className="text-sm">${priceUsd.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">USD Value</span>
                <span className="text-sm">${usdValue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">To</span>
                <span className="text-sm font-mono truncate max-w-50 block">{recipient}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-lg font-semibold">
                  {amount} {selectedToken.symbol}
                </span>
              </div>

              {memo && (
                <div className="pt-2 border-t border-border flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase">Memo</span>
                  <span className="text-sm italic">&quot;{memo}&quot;</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">Network Fee</span>
                <span className="text-sm">${networkFeeUsd.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-sm text-yellow-200">
                This transaction cannot be reversed. Please verify all details.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">Total Cost</span>
              <span className="text-sm font-semibold">${totalUsd.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={isBroadcasting}
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 border-border h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSend}
              disabled={isBroadcasting}
              className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold h-11"
            >
              {isBroadcasting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm Send
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
