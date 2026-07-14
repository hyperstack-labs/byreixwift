# Backend Architecture

This document describes the system topology, database design patterns, and the escrow state machine.

---

## 1. System Topology

```
Client (Next.js) ──HTTPS──► API Service (NestJS)
                                  │
                          ┌───────┴───────┐
                          ▼               ▼
                   PostgreSQL        Sidra Chain RPC
                   (Drizzle ORM)     (viem client)
```

---

## 2. Modules

| Module | Path | Description |
| :--- | :--- | :--- |
| Auth | `src/auth/` | SIWE authentication, JWT access/refresh token issuance. |
| Escrows | `src/escrows/` | Escrow CRUD, validation pipelines, and state transitions. |
| Token | `src/token/` | Fetches live coin metrics and historical pricing from Sidra explorer stats. |
| Kyc | `src/kyc/` | Manages OIDC authentication with KYCPort, supporting local development bypass. |
| Contracts | `src/contract/` | Read-only blockchain client (Viem) with mock mode fallback. |
| DB | `src/db/` | Drizzle ORM database client setup, schemas, and migrations. |

---

## 3. Database Schema

### `users`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key |
| `address` | `text` | Wallet address (unique) |
| `kyc_status` | `text` | Verification status (`none`, `verified`) |
| `kyc_tier` | `text` | KYC tier clearance level |
| `kyc_verified_at` | `timestamp`| Verification timestamp |
| `created_at` | `timestamp` | Auto-generated timestamp |

### `refresh_tokens`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key → `users.id` |
| `token` | `text` | Hashed refresh token |
| `expires_at` | `timestamp` | Token expiration date |
| `revoked` | `boolean` | Revocation status |
| `created_at` | `timestamp` | Auto-generated timestamp |

### `escrows`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key |
| `buyer` | `text` | Wallet address of the buyer |
| `seller` | `text` | Wallet address of the seller |
| `amount` | `numeric(20,8)`| Escrow capital amount |
| `token_symbol` | `text` | Token (e.g. `SDA`, `BRXW`) |
| `description` | `text` | Description of goods/services |
| `fixed_fee` | `numeric(20,8)`| Fixed billing service fee |
| `state` | `text` | State: `pending`, `locked`, `released`, `refunded` |
| `on_chain_id` | `integer` | Sequential transaction ID on-chain (nullable) |
| `tx_hash` | `text` | Transaction hash of the contract log (nullable) |
| `created_at` | `timestamp` | Auto-generated creation timestamp |
| `updated_at` | `timestamp` | Last update timestamp |

### `escrow_events`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key |
| `escrow_id` | `uuid` | Foreign key → `escrows.id` |
| `type` | `text` | Event type (e.g. `EscrowCreated`) |
| `state` | `text` | State at the time of the event |
| `metadata` | `text` | Optional JSON metadata payload |
| `occurred_at` | `timestamp` | Timestamp of the event |

---

## 4. Escrow State Machine

```
[*] ──► pending
          │
          ▼ (buyer locks)
        locked
          │
     ┌────┴────┐
     ▼         ▼
  released  refunded
     │         │
     └────┬────┘
          ▼
         [*]
```

### Valid Transitions
* `pending` → `locked`: The buyer calls `lock()` and locks funds on the contract.
* `locked` → `released`: The buyer calls `release()`, or the **arbitrator/owner** calls `arbitrateRelease()` during disputes.
* `pending` → `refunded`: The seller calls `refund()` to reject the escrow.
* `locked` → `refunded`: The seller calls `refund()`, or the **arbitrator/owner** calls `arbitrateRefund()` during disputes.

---

## 5. Authentication Flow
1. Frontend requests a Sign-In with Ethereum (SIWE) message from `POST /api/auth/siwe/initiate`.
2. User signs the generated message via MetaMask/Web3 wallet.
3. Frontend submits the signature to `POST /api/auth/siwe/verify`.
4. Server verifies the cryptographic signature against the active nonce, registering the user in the database if new, and returns JWT access + refresh token cookies.
5. REST API routes are secured via NestJS `JwtAuthGuard`.
