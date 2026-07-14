# Backend Architecture

This document describes the system topology, database design patterns, and the escrow state machine.

## 1. System Topology

```
Client (Next.js) ──HTTPS──► API Service (NestJS)
                                  │
                          ┌───────┴───────┐
                          ▼               ▼
                   PostgreSQL        Sidrachain RPC
                   (Drizzle ORM)     (viem client)
```

## 2. Modules

| Module | Path | Description |
|---|---|---|
| Auth | `src/auth/` | SIWE authentication, JWT issuance/refresh |
| Escrows | `src/escrows/` | Escrow CRUD, state machine transitions |
| Contracts | `src/contracts/` | Read-only blockchain client (viem) with mock fallback |
| DB | `src/db/` | Drizzle ORM setup (PostgreSQL connection + schema) |

## 3. Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| address | text | Wallet address (unique) |
| created_at | timestamp | Auto-generated |

### `refresh_tokens`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK → users.id |
| token | text | Hashed refresh token |
| expires_at | timestamp | Expiration |
| revoked | boolean | Revocation flag |

### `escrows`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| buyer | text | Wallet address |
| seller | text | Wallet address |
| amount | numeric(20,8) | Escrow amount |
| token_symbol | text | Token (e.g. SDA) |
| description | text | Purpose of transaction |
| fixed_fee | numeric(20,8) | Service fee |
| state | text | `pending`, `locked`, `released`, `refunded` |
| created_at | timestamp | Auto-generated |
| updated_at | timestamp | Updated on transition |

### `escrow_events`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| escrow_id | uuid | FK → escrows.id |
| type | text | Event type (e.g. EscrowCreated) |
| state | text | State at time of event |
| metadata | text | Optional JSON payload |
| occurred_at | timestamp | Event timestamp |

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

Valid transitions:
- `pending` → `locked` (buyer calls lock)
- `locked` → `released` (buyer calls release)
- `pending` → `refunded` (seller calls refund)
- `locked` → `refunded` (seller calls refund)

## 5. Auth Flow

1. Frontend requests SIWE message from `POST /auth/siwe/initiate`
2. User signs message with their wallet
3. Frontend sends signature to `POST /auth/siwe/verify`
4. Server verifies signature, returns JWT access + refresh tokens
5. Subsequent requests include JWT in `Authorization: Bearer` header
6. `JwtAuthGuard` protects all escrow endpoints
