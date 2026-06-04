"use client";

import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { defineChain } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Custom Sidrachain network
export const sidrachain = defineChain({
  id: 97_453,
  name: "Sidrachain",
  nativeCurrency: {
    name: "Sidra",
    symbol: "SDRA", // Standard fallback symbol
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://node.sidrachain.com"],
    },
  },
});

export const config = createConfig({
  chains: [mainnet, sepolia, sidrachain],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [sidrachain.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
