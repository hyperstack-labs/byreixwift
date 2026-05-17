# Backend Architecture & Database Source of Truth

This document serves as the 'Source of Truth' for the backend architecture.

---

## 1. System Topology Overview

The backend handles the communication between the client, PostgreSQL as database layer, and the blockchain network.


```mermaid 
   graph TD
   Client[Frontend Client] --> |HTTPS| API[Backend API Service]
   API --> |Drizzle ORM| DB[PostgreSQL Daatabase]
   API --> |RPC Provider| Blockchain((Blockchain Network))
   Worker[Event Listener / Indexer] -->|Polls / Listens| Blockchain
   Worker -->|Writes Events| DB
```
## 2. Database Schema and Entity Relationships

The data layer is managed using Drizzle ORM connected to PostgreSQL. All primary identifiers are randomly generated UUIDs.
   
   **NOTE**: relationships between escrows and users are tracked via the public cryptographic wallet string/address instead of the randomly generated internal database uuid. This allows direct, seamless  off-chain verficiation of on-chain entities without looking up surrogate IDs.

### ERD 
![Alt Text](./ERD.png)

## 3. The Escrow State Machine
Escrow business logic depends strictly on state updates. The state field in both escrows and escrow_events tables must adhere to the following transition constraints: 
```mermaid
stateDiagram-v2
    [*] --> pending

    pending --> funded : Smart contract event listener confirms on-chain deposit
    pending --> cancelled : Buyer cancels before funding. records are cleaned up/flagged

    funded --> released : Buyer confirms delivery. smart contract releases funds to seller
    funded --> disputed : Buyer or seller triggers a dispute lock

    disputed --> resolved : Arbiter rules on the split, or parties reach mutual agreement
    disputed --> refunded : Arbiter rules in favor of full return to the buyer

    cancelled --> [*]
    released --> [*]
    resolved --> [*]
    refunded --> [*]
```

## 4. Database Naming
All future database column and attributes definition should follow the snake_case convention(user_id, escrow_events, created_at). On the other hand, CamelCase is handled inside the application layer via Drizzle ORM config properties.
