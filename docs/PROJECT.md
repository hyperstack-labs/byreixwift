# Project Scope

Byreixwift is a fixed-fee escrow application designed for Sidrachain.

## Minimum Viable Product Scope

### Included Features

- Landing page containing a project overview.
- Wallet connection interface supporting Sidrachain-compatible wallets.
- Escrow creation interface tracking transaction amounts, fixed fees, and buyer/seller metadata.
- Escrow status tracker supporting the following states: `Pending`, `Locked`, `Released`, and `Refunded`.
- Mock API implementation mirroring the smart contract lifecycle for frontend development.
- Solidity smart contract implementing deposit, lock, release, and refund operations.

### Out of Scope

The following features are deferred to future releases:

- Dispute resolution and transaction arbitration.
- Multi-party and milestone-based escrows.
- Multi-chain support (e.g., Ethereum, Solana, zkSync).
- KYC and identity verification flows.
- Notification dispatching services.
- Administrative dashboards and transaction ledger analysis tools.
