"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Wallet, Loader2, AlertCircle, ArrowRight } from "lucide-react";

import { motion } from "motion/react";
import { useShake } from "@/hooks";

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<string[]>;
}

interface WalletLoginButtonProps {
  onConnect: (address: string) => void;
  disabled?: boolean;
}

export function WalletLoginButton({ onConnect, disabled = false }: WalletLoginButtonProps) {
  const [status, setStatus] = useState<"idle" | "connecting" | "error" | "no-wallet">("idle");

  const [error, setError] = useState("");

  const { shakeTrigger, triggerShake } = useShake();

  const handleConnect = async () => {
    setStatus("connecting");
    setError("");

    try {
      //STEP 1: Sidra Chain Wallet Detection
      // no sidra chain extension so will use metamask or simulation

      if (typeof window !== "undefined" && "ethereum" in window) {
        const provider = window.ethereum as unknown as EthereumProvider;

        // STEP 2: Sidra Chain Account Address request
        // There should be a popup where the sidra chain address will be shown

        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          const walletAddress = accounts[0];

          // Step 3: Web3 network check to ensure that the wallet is on the sidra chain (e.g sidra testnet)
          // if not switch to sidra testnet

          // Step 4: Backend authentication flow
          // API call to the Node/NestJS backend to issue a nonce.
          // The nonce will be signed by the wallet and verified by the API
          // before a real session token is returned.

          // SUCCESSFUL AUTHENTICATION

          setStatus("idle");
          onConnect(walletAddress);
        }
      } else {
        triggerShake();
        setStatus("no-wallet");
        setError("Sidra Wallet not detected. Please install the Sidra Wallet/Extention.");
      }
    } catch (err: unknown) {
      setStatus("error");
      triggerShake();
      if (err instanceof Error) {
        setError(err.message);
      } else {
        triggerShake();
        setError("Failed to connect wallet.");
      }
    }
  };

  return (
    <motion.div
      animate={shakeTrigger > 0 ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      key={shakeTrigger}
      className="space-y-3"
    >
      <Button
        onClick={handleConnect}
        disabled={status === "connecting" || disabled}
        className="flex items-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-7 text-base transition-all hover:shadow-[0_0_30px_rgba(38,213,120,0.3)] group"
      >
        {status === "connecting" ? (
          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
        ) : (
          <Wallet className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
        )}
        {status === "connecting" ? "Connecting..." : "Connect Sidra Wallet"}
        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
      </Button>

      {/* User Feedback/Error Message */}
      {(status === "error" || status === "no-wallet") && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </motion.div>
  );
}
