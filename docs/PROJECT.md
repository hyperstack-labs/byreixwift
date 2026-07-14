# Project Scope

Byreixwift is a fixed-fee escrow application built on Sidrachain.

## Implemented Features

- Landing page containing a project overview.
- Wallet connection interface supporting Sidrachain-compatible wallets (wagmi + MetaMask).
- Escrow creation interface tracking transaction amounts, fixed fees, and buyer/seller metadata.
- Escrow status tracker supporting the following states: `pending`, `locked`, `released`, and `refunded`.
- REST API for escrow CRUD (NestJS + PostgreSQL + Drizzle ORM).
- Authentication via Sign-In with Ethereum (SIWE) + JWT.
- Solidity smart contract implementing deposit, lock, release, and refund operations (deployed & tested).
- Deploy scripts for local Hardhat network and Sidrachain mainnet.
- Real SDA balance display via Sidrachain RPC.
- Real SDA transfer via wagmi `useSendTransaction`.
- Simulation toggle for escrow (mock mode via REST API vs live mode via smart contract).
- Data provider abstraction pattern (mock providers for dev, Sidra providers for production).
- CMS admin panel (announcements CRUD, banner ad management).
- Token price trend charts (mock data, ready for Sidra API).
- Token swap interface (UI shell — Sidrachain has no DEX yet).
- CI/CD pipelines (GitHub Actions: lint + build on PR, deploy client & server to Vercel).
- Docker setup (client, server, PostgreSQL via docker-compose).
- Tests: 4 contract tests (Hardhat), 12 server tests (Jest), 5 client tests (Vitest).

## Out of Scope (Future Releases)

- Dispute resolution and transaction arbitration.
- Multi-party and milestone-based escrows.
- Multi-chain support (e.g., Ethereum, Solana, zkSync).
- KYC and identity verification flows.
- Notification dispatching services.
- Proof of Personhood / sybil resistance (pending Sidrachain release).
- ERC-4337 smart account wallet (pending Sidrachain release).
- L3 RWA tokenization (pending Sidrachain release).
- KYCPort integration (pending Sidrachain release).
