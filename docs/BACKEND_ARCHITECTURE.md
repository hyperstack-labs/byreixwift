# Backend Architecture & Database Source of Truth

This document serves as the 'Source of Truth' for the backend architecture.

---

## 1. System Topology Overview

The backend handles the communication between the client, PostgreSQL as database layer, and the blockchain network.

```mermaid
%%{init: {'theme': 'dark'}}%%
graph TD
   Client[Frontend Client] --> |HTTPS| API[Backend API Service]
   API --> |Drizzle ORM| DB[PostgreSQL Database]
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
%%{init: {'theme': 'dark'}}%%
stateDiagram-v2
   [*] --> pending

   pending --> locked : Smart contract event listener confirms<br/>on-chain deposit, initiate lock of funds
   
   locked --> released : Buyer confirms delivery.<br/>Smart contract releases funds to seller
   released --> refunded : funds transfer to the buyer

   refunded --> not funded : unsuccessful funding. <br/> Smart contract returns fund to buyer

   

   disputed --> resolved : Arbiter rules on the split,<br/>or parties reach mutual agreement
   disputed --> refunded : Arbiter rules in favor of<br/>full return to the buyer

   pending --> cancelled : User cancels before funding
   cancelled --> [*]
   released --> [*]
   resolved --> [*]
   refunded --> [*]
```

## 4. Database Naming
All future database column and attributes definition should follow the snake_case convention(user_id, escrow_events, created_at). On the other hand, CamelCase is handled inside the application layer via Drizzle ORM config properties.
