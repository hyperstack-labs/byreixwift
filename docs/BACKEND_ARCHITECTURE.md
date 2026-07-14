# Backend Architecture

This document describes the system topology, database design patterns, and the escrow state machine.

## 1. System Topology

The backend application bridges the frontend client, the PostgreSQL database, and the Sidrachain network:

```mermaid
%%{init: {'theme': 'dark'}}%%
graph TD
   Client[Frontend Client] --> |HTTPS| API[Backend API Service]
   API --> |Drizzle ORM| DB[PostgreSQL Database]
   API --> |RPC Provider| Blockchain((Blockchain Network))
   Worker[Event Listener / Indexer] -->|Polls / Listens| Blockchain
   Worker -->|Writes Events| DB
```

## 2. Database Schema Guidelines

The database layer follows these implementation patterns:

- **ORM**: Configure and execute all queries using Drizzle ORM.
- **Primary Keys**: Generate random UUIDs for all table primary identifiers.
- **Foreign Keys & Verification**:
  - Relate user profiles to escrows using public cryptographic wallet addresses instead of database UUIDs.
  - This pattern allows off-chain services to verify transactions without mapping surrogate identifiers.
- **Database Column Naming**: Use `snake_case` naming conventions for database tables and columns.
- **Application Naming**: Map database attributes to `camelCase` identifiers in the NestJS application layer via the Drizzle configuration.

## 3. Escrow State Machine Transitions

Update escrow and event records only according to the following state constraints:

```mermaid
stateDiagram-v2
   [*] --> pending

   pending --> locked : Confirm smart contract deposit
   
   locked --> released : Buyer confirms delivery (funds transfer to seller)
   released --> refunded : Return funds to buyer

   released --> not_funded : Mark unsuccessful funding
   not_funded --> disputed : Raise dispute over funding timeout
   not_funded --> resolved : Acknowledge mutual cancellation

   disputed --> [*]
   resolved --> [*]
   refunded --> [*]
```
