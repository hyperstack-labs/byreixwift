"use client";

import { Button } from "./ui/button";
import { Wallet, Loader2, AlertCircle, ArrowRight } from "lucide-react";

import { motion } from "motion/react";
import { useAccount, useConnect } from "wagmi";
import { useShake, useIsClient } from "@/hooks";

interface WalletLoginButtonProps {
  onConnect?: (address: string) => void;
  disabled?: boolean;
}

export function WalletLoginButton({ disabled = false }: WalletLoginButtonProps) {
  const isClient = useIsClient();
  const { isConnecting } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { shakeTrigger, triggerShake } = useShake();

  const handleConnect = async () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    } else {
      triggerShake();
    }
  };

  if (!isClient) {
    return (
      <Button
        disabled
        className="flex items-center w-full bg-primary/50 text-primary-foreground font-semibold py-7 text-base rounded-xl opacity-50 cursor-not-allowed"
      >
        <Wallet className="w-6 h-6 mr-3" />
        Initializing...
      </Button>
    );
  }

  return (
    <motion.div
      animate={shakeTrigger > 0 ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      key={shakeTrigger}
      className="space-y-3"
    >
      <Button
        onClick={handleConnect}
        disabled={isConnecting || disabled}
        className="flex items-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-7 text-base transition-all hover:shadow-[0_0_30px_rgba(38,213,120,0.3)] group"
      >
        {isConnecting ? (
          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
        ) : (
          <Wallet className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
        )}
        {isConnecting ? "Connecting..." : "Connect Sidra Wallet"}
        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
      </Button>

      {/* User Feedback/Error Message */}
      {connectError && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{connectError.message}</p>
        </div>
      )}

      {/* No Wallet Detected Warning */}
      {connectors.length === 0 && (
        <div className="flex flex-col gap-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm mt-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-bold">No Web3 Wallet Detected</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please install or enable a browser wallet extension (like MetaMask, Coinbase Wallet, or
            Trust Wallet) to sign in to Sidrachain.
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline font-bold mt-1 inline-flex items-center"
          >
            Get MetaMask extension &rarr;
          </a>
        </div>
      )}
    </motion.div>
  );
}
