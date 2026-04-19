"use client";

import { Button } from "./ui/button";
import { Wallet, Loader2, AlertCircle, ArrowRight } from "lucide-react";

import { motion } from "motion/react";
import { useAccount, useConnect } from "wagmi";
import { useShake } from "@/hooks";

interface WalletLoginButtonProps {
  onConnect?: (address: string) => void;
  disabled?: boolean;
}

export function WalletLoginButton({ disabled = false }: WalletLoginButtonProps) {
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
    </motion.div>
  );
}
