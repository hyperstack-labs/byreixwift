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
} from "../ui";
import { Send, QrCode, Scan, ChevronDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useSidraTokens } from "@/hooks/useSidraTokens";

export function SendPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken] = useState({ symbol: "SDA", balance: "12,450.50" });
  const [memo, setMemo] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(true);
  const { data: tokens } = useSidraTokens();

  const selectedTokenData = tokens?.find((t) => t.symbol === selectedToken.symbol);

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

  const confirmSend = () => {
    setShowConfirmDialog(false);
    toast.success("Transaction sent successfully!");
    // Reset form
    setRecipient("");
    setAmount("");
    setMemo("");
  };

  const recentContacts = [
    { name: "Exchange Wallet", address: "0x742d...9aB8" },
    { name: "Savings", address: "0x9f3a...7cD2" },
    { name: "John Doe", address: "0x5e8b...4fA1" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-20 md:pb-12 min-h-screen">
      <Card className="p-5 md:p-6 bg-card border-border shadow-sm">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Send Tokens</h2>

        <div className="space-y-6">
          {/* Recipient Address */}
          <div className="space-y-2">
            <Label htmlFor="recipient" className="px-1 text-sm">
              Recipient Address
            </Label>
            <div className="relative">
              <Input
                id="recipient"
                placeholder="0x... or ENS name"
                value={recipient}
                onChange={(e) => handleRecipientChange(e.target.value)}
                className={`pr-24 bg-background border-border h-12 ${
                  !isValidAddress && recipient ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Scan className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-muted-foreground hover:text-primary transition-colors"
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

          {/* Token Selection and Amount */}
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
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent border-none text-3xl md:text-4xl p-0 h-auto focus-visible:ring-0 flex-1 min-w-0"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-border bg-card hover:bg-border h-10 px-3 shrink-0"
                >
                  <span className="font-bold">{selectedToken.symbol}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground font-medium">
                  ≈ $
                  {usdValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <button
                  onClick={() => setAmount(selectedToken.balance.replace(/,/g, ""))}
                  className="text-sm font-semibold text-primary hover:underline underline-offset-4"
                >
                  Use Maximum
                </button>
              </div>
            </div>
          </div>

          {/* Memo (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="memo" className="px-1 text-sm">
              Memo <span className="text-muted-foreground text-xs ml-1">(Optional)</span>
            </Label>
            <Input
              id="memo"
              placeholder="What is this for?"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="bg-background border-border h-11"
            />
          </div>

          {/* Transaction Details */}
          {amount && numericAmount > 0 && (
            <div className="p-4 rounded-xl bg-background border border-border space-y-3 animate-in fade-in zoom-in-95 duration-200">
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
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Estimated Time</span>
                <span>~30 seconds</span>
              </div>
            </div>
          )}

          {/* Send Button */}
          <Button
            onClick={handleSend}
            className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-black py-7 text-lg font-bold transition-all active:scale-[0.98]"
          >
            <Send className="w-5 h-5 mr-2" />
            {amount ? `Review Transaction` : "Send Tokens"}
          </Button>
        </div>
      </Card>

      {/* Recent Contacts */}
      <div className="mt-8 space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">
          Recent Contacts
        </h3>
        <div className="space-y-3">
          {recentContacts.map((contact, index) => (
            <button
              key={index}
              onClick={() => {
                setRecipient(contact.address);
                setIsValidAddress(true);
              }}
              className="w-full cursor-pointer flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-left group"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{contact.name}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {contact.address}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 group-hover:text-primary transition-colors shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-card border-border sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>
              Please review the transaction details before confirming.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="p-4 rounded-lg bg-background border border-border space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase">Recipient</span>
                <span className="text-sm font-mono break-all leading-relaxed bg-muted/30 p-2 rounded border border-border/50">
                  {recipient}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase">Amount</span>
                  <span className="text-lg font-bold">
                    {amount} {selectedToken.symbol}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs text-muted-foreground uppercase">Total USD</span>
                  <span className="text-lg font-bold">${totalUsd.toFixed(2)}</span>
                </div>
              </div>

              {memo && (
                <div className="pt-2 border-t border-border flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase">Memo</span>
                  <span className="text-sm italic">&quot;{memo}&quot;</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-xs text-yellow-200/90 leading-normal">
                This transaction cannot be reversed once confirmed. Ensure the address and amount
                are correct.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 border-border h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSend}
              className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold h-11"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
