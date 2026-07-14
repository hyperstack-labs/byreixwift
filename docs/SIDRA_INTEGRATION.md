# Sidra Chain Integration Guide

This document describes how ByReiXwift connects to the Sidra Chain network and its block explorer API endpoints.

---

## 1. Blockchain Connection

### Network Configuration
Sidra Chain parameters are registered in three places:

| Location | Purpose |
| :--- | :--- |
| `client/src/providers/Web3Provider.tsx` | Wagmi chain definition (Chain ID: `97453`, RPC: `https://node.sidrachain.com`) |
| `contracts/hardhat.config.js` | Hardhat network configuration for compiling and deploying smart contracts |
| `server/.env` / `contracts/.env` | RPC node url and smart contract configuration for backend event verification |

### Wallet Balance (Real)
The React hook `hooks/useSdaBalance.ts` queries the connected wallet's SDA balance directly from the Sidra Chain RPC via the Wagmi `useBalance` hook. It polls the network every 10 seconds.

### Sending SDA (Real)
`SendPage.tsx` uses Wagmi's `useSendTransaction` hook to broadcast token transfer transactions directly to the Sidra Chain network via MetaMask.

### Escrow Transactions (Live Mode)
When the Escrow Page is toggled to **Live** mode:
1. Smart contract interactions are broadcast directly to the deployed `ByReiXwiftEscrow` contract address on-chain using Wagmi's `useWriteContract` hook.
2. Once verified, the client sends the transaction hash and details to the NestJS API.
3. The NestJS backend `ContractService` uses a Viem `PublicClient` to fetch the transaction receipt from the Sidra Chain RPC, validates the log parameters, and registers the escrow in the database.
4. Escrow entries explicitly map to `onChainId` and `txHash` database columns.

---

## 2. Frontend Data Provider Abstraction

The client separates page displays from data fetch sources using a Factory Pattern:

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
       ├──► SidraTokenDataProvider      ← Fetches from NestJS Backend when USE_MOCK=false
       └──► SidraTrendDataProvider      ← Fetches from NestJS Backend when USE_MOCK=false
```

To switch the client to query live backend API endpoints:
```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_SIDRA_API_URL=http://localhost:3001/api/
```

---

## 3. Backend Token Bridge API

The NestJS backend implements a Token Module that bridges pricing queries to Sidra Chain's block explorer API.

### Endpoints
* **Get Token List:** `GET /api/token/list` returns active supported tokens (SDA and BRXW).
* **Get Token History:** `GET /api/token/history?symbol=SDA&range=7D` generates pricing trends. Supported ranges include `1H`, `24H`, `7D`, `30D`, `1Y`.

### Explorer Integration
The backend `TokenService` queries the official Sidra block explorer Blockscout API stats endpoint:
```
https://ledger.sidrachain.com/api/v2/stats
```
* On success, it extracts `coin_price` and `market_cap` directly from the on-chain explorer stats.
* On network timeout or rate-limits, it degrades gracefully to local cached fallback values to ensure server reliability.
* It generates a random-walk historical dataset backward from the current explorer price to supply the client Recharts components (since the block explorer does not expose long-term historical price trend JSON arrays for custom tokens).
