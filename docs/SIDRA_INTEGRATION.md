# Sidra Data Integration Guide

This document describes how to integrate official Sidra API endpoints and configure data providers.

## Architecture

The client separates page displays from data fetch providers:

```
Page / Component
       │ (Read data only from custom React Query hooks)
       ▼
React Query Hooks      (useSidraTokens, useTrendData)
       │ (Request data from factory)
       ▼
DataProviderFactory    (providers/data/DataProviderFactory.ts)
       │ (Return active provider configuration)
       ├──► MockTokenDataProvider
       ├──► MockTrendDataProvider
       ├──► SidraTokenDataProvider (Real API integration stub)
       └──► SidraTrendDataProvider (Real API integration stub)
```

**Rule**: Do not import data providers or mock data classes directly into UI components. Use the React Query hooks.

## Configure the Active Data Provider

Select the active provider using one of the following methods:

### Option 1: Set Environment Variables (Recommended)

Configure the following variables in your local `.env.local` file:

```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_SIDRA_API_URL=http://localhost:3001/api/
```

### Option 2: Modify the Code Configuration Toggle

Change the flag value inside `providers/data/DataProviderFactory.ts`:

```ts
export const USE_MOCK: boolean = false;
```

## Data Requirements and Endpoints

### Token Metrics Data

- **Primary Token**: `SDA` (Sidra Coin).
- **Price Denomination**: US Dollars (`USD`).
- **Endpoints**:
  - List: `GET /token/list`
  - Metrics: `GET /token/metrics?symbol=SDA`
- **Authentication**: Include the `X-Sidra-Key` header on requests.
- **Cache Lifecycle**: Configure a 5-minute cache lifespan (`staleTime` in `hooks/useSidraTokens.ts`).

### Trend and Historical Price Data

- **Endpoint**: `GET /token/history?symbol=SDA&range=7D`
- **Response Format**: `Array<{ timestamp: string; priceUsd: number }>`
- **Supported Ranges**: `1H`, `24H`, `7D`, `30D`, `1Y`
- **Time Format**: ISO 8601 UTC string.
- **Cache Lifecycle**: Configure a 2-minute limit for short ranges (1H, 24H) and 60 minutes for long ranges (30D, 1Y).

### Dashboard and Balance Data

- **Wallet Balance**: Fetch balance metrics directly from the blockchain RPC.
- **Transactions**: Read transaction history entries from the backend database.
- **Circulating Supply**: Fall back to a default value of `100 Billion SDA`.
- **All Time High**: Fall back to a default value of `$3.45`.

## Add a New Data Domain

Implement new data categories by executing the following steps:

1. Define the provider interface (e.g., `providers/data/IWalletDataProvider.ts`).
2. Write a mock implementation (e.g., `providers/data/mock/MockWalletDataProvider.ts`).
3. Write a production implementation stub (e.g., `providers/data/sidra/SidraWalletDataProvider.ts`).
4. Register the new provider inside `DataProviderFactory.ts`.
5. Create a React Query hook (e.g., `hooks/useWalletBalances.ts`) that requests the provider from the factory.
6. Import and execute the custom hook inside your UI components.

## Directory Layout

```
client/src/
├── providers/
│   └── data/
│       ├── ITokenDataProvider.ts          # Token list and metrics interface
│       ├── ITrendDataProvider.ts          # Historical price interface
│       ├── DataProviderFactory.ts         # Factory class resolver
│       ├── mock/
│       │   ├── MockTokenDataProvider.ts   # Mock token metrics
│       │   └── MockTrendDataProvider.ts   # Mock historical chart points
│       └── sidra/
│           ├── SidraTokenDataProvider.ts  # API implementation stub
│           └── SidraTrendDataProvider.ts  # API implementation stub
├── hooks/
│   ├── useSidraTokens.ts                  # Token metrics query hook
│   └── useTrendData.ts                    # Trend metrics query hook
└── types/
    └── sidra.ts                           # Shared type declarations
```