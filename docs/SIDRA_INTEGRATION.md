# Sidra Data Integration Guide

This document describes the assumptions made during the token and trend
architecture refactor, and provides a step-by-step guide for wiring in
official Sidra API data when it becomes available.

---

## Architecture Overview

```
Page / Display Component
        │  (reads only from hooks)
        ▼
   React Query Hook          useSidraTokens · useTrendData
        │  (calls factory)
        ▼
  DataProviderFactory        providers/data/DataProviderFactory.ts
        │  (returns one of)
        ├──► MockTokenDataProvider     providers/data/mock/
        ├──► MockTrendDataProvider     providers/data/mock/
        ├──► SidraTokenDataProvider    providers/data/sidra/   ← stub, ready to fill
        └──► SidraTrendDataProvider    providers/data/sidra/   ← stub, ready to fill
```

**Rule:** Page and display components import hooks only. They never import
providers, service files, or mock data directly. This is enforced by the
layer boundaries above.

---

## How to Swap Mock → Real Sidra Data

### Option A — Environment variable (recommended)

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_SIDRA_API_URL=http://localhost:3001/api/
```

No code changes required. `DataProviderFactory` reads the flag at module
load time and returns `SidraTokenDataProvider` / `SidraTrendDataProvider`.

### Option B — Code toggle

```ts
// providers/data/DataProviderFactory.ts
export const USE_MOCK: boolean = false; // flip this line
```

---

## Assumptions

### Token Data

| Assumption | Rationale | Where to change if wrong |
|---|---|---|
| Primary token is `SDA` (Sidra Coin) | Based on Sidra ecosystem naming | `MockTokenDataProvider.ts` → `MOCK_TOKENS` |
| `priceUsd` is denominated in US dollars | Standard convention; Sidra may use SAR | Add `priceFiat` field to `SidraTokenMetric` type |
| Token list endpoint: `GET /token/list` | Conventional REST naming | `SidraTokenDataProvider.getTokenList()` |
| Token metrics endpoint: `GET /token/metrics?symbol=SDA` | Conventional REST naming | `SidraTokenDataProvider.getTokenMetrics()` |
| Response schema matches `SidraTokenMetric` interface | To be confirmed | Add a `mapResponse()` in `SidraTokenDataProvider` if field names differ |
| Auth uses `X-Sidra-Key` header | Common API-key pattern; TBD | `SidraTokenDataProvider.ts` → `sidraFetch()` headers |
| Cache TTL: 5 minutes for token list | Reasonable for near-real-time pricing | `hooks/useSidraTokens.ts` → `staleTime` |

### Trend / Historical Price Data

| Assumption | Rationale | Where to change if wrong |
|---|---|---|
| History endpoint: `GET /token/history?symbol=SDA&range=7D` | Conventional REST naming | `SidraTrendDataProvider.getTrendData()` |
| Response shape: `Array<{ timestamp: string; priceUsd: number }>` | Standard OHLCV-lite format | `SidraTrendDataProvider.ts` → `SidraHistoryPoint` interface |
| Supported ranges: `1H · 24H · 7D · 30D · 1Y` | Typical exchange convention | `SidraTrendDataProvider.SIDRA_SUPPORTED_RANGES` |
| `timestamp` is ISO 8601 UTC | Universal standard | `SidraTrendDataProvider.formatLabel()` |
| Mock chart data is symbol-agnostic | Simplicity; real API will differentiate | `MockTrendDataProvider.getTrendData()` — `_symbol` param is ignored |
| Cache TTL: 2 min for 1H/24H, 60 min for 30D/1Y | Tighter refresh for short windows | `SidraTrendDataProvider.getTrendData()` → `next: { revalidate }` |

### Dashboard / Wallet Data

| Assumption | Rationale | Where to change if wrong |
|---|---|---|
| `WalletDashboard` token balances are hardcoded | Wallet balance requires on-chain read; out of scope for this refactor | Create `IWalletDataProvider` + `useWalletBalances()` hook when ready |
| Transaction history is hardcoded | Requires a backend ledger (PostgreSQL, planned) | Create `ITransactionProvider` + `useTransactions()` hook when ready |
| Circulating supply is hardcoded (`100 Billion SDA`) | Not in current Sidra API scope | Add `circulatingSupply` to `SidraTokenMetric` and surface in `SidraTokenDataProvider` |
| All Time High is hardcoded (`$3.45`) | Not in current Sidra API scope | Add `ath` to `SidraTokenMetric` and surface in `SidraTokenDataProvider` |

---


## Adding a New Data Domain

Follow this pattern to extend the architecture (e.g. wallet balances, transactions):

```
1. Define the contract
   providers/data/IWalletDataProvider.ts

2. Write mock implementation
   providers/data/mock/MockWalletDataProvider.ts

3. Write real implementation stub
   providers/data/sidra/SidraWalletDataProvider.ts

4. Register in the factory
   providers/data/DataProviderFactory.ts → add getWalletProvider()

5. Create a hook
   hooks/useWalletBalances.ts → calls DataProviderFactory.getWalletProvider()

6. Consume in pages
   components/pages/WalletDashboard.tsx → import { useWalletBalances }
```

No page component should be modified for steps 1–4.

---

## File Map

```
client/src/
├── providers/
│   └── data/
│       ├── ITokenDataProvider.ts          Interface: token list & metrics
│       ├── ITrendDataProvider.ts          Interface: historical price data
│       ├── DataProviderFactory.ts         Singleton factory, env-controlled
│       ├── mock/
│       │   ├── MockTokenDataProvider.ts   Dev/test mock — only file with hardcoded tokens
│       │   └── MockTrendDataProvider.ts   Dev/test mock — only file with hardcoded chart data
│       └── sidra/
│           ├── SidraTokenDataProvider.ts  Production stub — fill when API is live
│           └── SidraTrendDataProvider.ts  Production stub — fill when API is live
├── hooks/
│   ├── useSidraTokens.ts                  Token list + single-token metrics
│   └── useTrendData.ts                    Historical chart data + supported ranges
├── services/
│   └── tokenMetrics.ts                    @deprecated shim — safe to delete after migration
└── types/
    └── sidra.ts                           SidraTokenMetric — add fields here as API expands
```