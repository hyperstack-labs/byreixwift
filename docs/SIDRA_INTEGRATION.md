# Sidra Chain Integration Guide

This document describes how ByReiXwift connects to the Sidrachain network and Sidra API endpoints.

## Blockchain Connection

### Network Configuration

Sidrachain is configured in three places:

| Location | Purpose |
|---|---|
| `client/src/providers/Web3Provider.tsx` | Wagmi chain definition (chain ID 97453, RPC: `https://node.sidrachain.com`) |
| `contracts/hardhat.config.js` | Hardhat network config for deployment |
| `server/.env` / `contracts/.env` | RPC URL and chain ID for backend |

### Wallet Balance (Real)

`hooks/useSdaBalance.ts` fetches the connected wallet's SDA balance directly from the Sidrachain RPC via wagmi `useBalance`. Polls every 10 seconds.

### Sending SDA (Real)

`SendPage.tsx` uses wagmi `useSendTransaction` to broadcast transfers to the Sidrachain network. The user must have a connected wallet (MetaMask or WalletConnect).

### Escrow Transactions (Live Mode)

When the escrow page is toggled to "Live" mode, transactions go through the deployed `ByReiXwiftEscrow` contract on-chain via wagmi `useWriteContract`. In "Simulation" mode, all operations hit the REST API (PostgreSQL).

**Prerequisite:** The escrow contract must be deployed and `NEXT_PUBLIC_CONTRACT_ADDRESS` must be set in `client/.env.local`.

## Data Provider Abstraction

The client separates page displays from data fetch sources using a factory pattern:

```
Page / Component
       │ (Read data only from custom React Query hooks)
       ▼
React Query Hooks      (useSidraTokens, useTrendData)
       │ (Request data from factory)
       ▼
DataProviderFactory    (providers/data/DataProviderFactory.ts)
       │ (Return active provider based on env flag)
       ├──► MockTokenDataProvider       ← Used when NEXT_PUBLIC_USE_MOCK=true (default)
       ├──► MockTrendDataProvider       ← Used when NEXT_PUBLIC_USE_MOCK=true (default)
       ├──► SidraTokenDataProvider      ← Fetches from Sidra API when USE_MOCK=false
       └──► SidraTrendDataProvider      ← Fetches from Sidra API when USE_MOCK=false
```

**Switch to real providers:**
```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_SIDRA_API_URL=http://localhost:3001/api/
```

## Data Requirements (Sidra API)

### Token Metrics
- **Endpoint**: `GET /token/list`, `GET /token/metrics?symbol=SDA`
- **Authentication**: `X-Sidra-Key` header
- **Cache**: 5-minute `staleTime`

### Trend / Historical Price
- **Endpoint**: `GET /token/history?symbol=SDA&range=7D`
- **Response**: `Array<{ timestamp: string; priceUsd: number }>`
- **Ranges**: `1H`, `24H`, `7D`, `30D`, `1Y`
- **Cache**: 2 min (short ranges), 60 min (long ranges)

### Dashboard / Balance
- **Wallet Balance**: Fetched directly from Sidrachain RPC (NOT from the Sidra API)
- **Transactions**: Read from the backend PostgreSQL database
- **Circulating Supply**: Falls back to `100 Billion SDA`
- **All Time High**: Falls back to `$3.45`

## Adding a New Data Domain

1. Define the provider interface (e.g., `providers/data/IWalletDataProvider.ts`).
2. Write a mock implementation.
3. Write a Sidra API implementation.
4. Register both in `DataProviderFactory.ts`.
5. Create a React Query hook that uses the factory.
6. Use the hook in your UI components.
