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

  const { data: tokenData } = useSidraTokens();

  const selectedTokenData = tokenData?.find(
    (t) => t.symbol === selectedToken.symbol
  );


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
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 bg-card border-border">
        <h2 className="text-2xl font-semibold mb-6">Send Tokens</h2>
 
        <div className="space-y-6">
          {/* ── Recipient ─────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <div className="relative">
              <Input
                id="recipient"
                placeholder="Enter wallet address"
                value={recipient}
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
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                >
                  <Scan className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {!isValidAddress && recipient && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Invalid address format
              </p>
            )}
          </div>
 
          {/*  Amount  */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="p-4 rounded-xl bg-background border border-border">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-border bg-card hover:bg-border"
                >
                  <span className="font-semibold">{selectedToken.symbol}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Balance: {selectedToken.balance}
                </span>
              </div>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent border-none text-3xl p-0 h-auto focus-visible:ring-0"
              />
              <button
                onClick={() => setAmount(String(amount))}
                className="text-sm text-primary mt-2 hover:underline"
              >
                Use Maximum Balance
              </button>
            </div>
          </div>
 
          {/*  Memo  */}
          <div className="space-y-2">
            <Label htmlFor="memo">
              Memo{" "}
              <span className="text-muted-foreground text-sm">(Optional)</span>
            </Label>
            <Input
              id="memo"
              placeholder="Add a note..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="bg-background border-border"
            />
          </div>
 
          {/*  Transaction details  */}
          {amount && (
            <div className="p-4 rounded-xl bg-background border border-border space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Token Value (USD)</span>
                <span className="text-foreground">${usdValue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Network Fee</span>
                <span className="text-foreground">
                  ${networkFeeUsd.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-foreground">
                  {amount} {selectedToken.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="text-foreground font-semibold">
                  ${totalUsd.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated Time</span>
                <span className="text-foreground">~30 seconds</span>
              </div>
            </div>
          )}
          {/*  Send button */}
          <Button
            onClick={handleSend}
            className="w-full bg-primary hover:bg-primary/90 text-black py-6 text-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            {amount
              ? `Send ${amount} ${selectedToken.symbol}`
              : "Send Tokens"}
          </Button>
        </div>
      </Card>
 
      {/*  Recent Contacts  */}
      <Card className="mt-6 p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Recent Contacts</h3>
        <div className="space-y-3">
          {recentContacts.map((contact) => (
            <button
              key={contact.address}
              onClick={() => {
                setRecipient(contact.address);
                setIsValidAddress(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-semibold">{contact.name}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {contact.address}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90" />
            </button>
          ))}
        </div>
      </Card>
 
      {/*Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>
              Please review the transaction details before confirming.
            </DialogDescription>
          </DialogHeader>
 
          <div className="space-y-4 my-4">
            <div className="p-4 rounded-lg bg-background border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Token Price
                </span>
                <span className="text-sm">${priceUsd.toFixed(4)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">USD Value</span>
                <span className="text-sm">${usdValue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">To</span>
                <span className="text-sm font-mono">{recipient}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-lg font-semibold">
                  {amount} {selectedToken.symbol}
                </span>
              </div>
              {memo && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Memo</span>
                  <span className="text-sm">{memo}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  Network Fee
                </span>
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
              <span className="text-sm font-semibold">
                ${totalUsd.toFixed(2)}
              </span>
            </div>
          </div>
 
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSend}
              className="flex-1 bg-primary hover:bg-primary/90 text-black"
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