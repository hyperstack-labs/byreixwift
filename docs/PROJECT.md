# Project Scope

Byreixwift is a fixed-fee escrow application built on Sidra Chain.

---

## Implemented Features

* **Landing Page:** Interactive dashboard containing a project overview and active statistics.
* **Wallet Connection:** Web3 wallet connection supporting Sidra Chain-compatible wallets (Wagmi + Viem + MetaMask).
* **Escrow Creation:** Interface tracking transaction amounts, fixed fees, and buyer/seller wallet metadata.
* **Escrow Lifecycle State Machine:** Full status tracker supporting `pending`, `locked`, `released`, and `refunded` states.
* **Dispute Arbitration:** Smart contract functions (`arbitrateRelease`, `arbitrateRefund`) allowing a configurable `arbitrator` role to resolve deadlocked funds.
* **On-Chain DB Mapping:** Normalized PostgreSQL schema using Drizzle ORM mapping escrows directly to `onChainId` and `txHash` columns rather than parsing description prefixes.
* **Production Security Guards:** Strict validation checks preventing local mock fallbacks or OIDC bypasses when running in production (`process.env.NODE_ENV === 'production'`).
* **Authentication:** Wallet-based secure authentication via Sign-In with Ethereum (SIWE) + JWT cookie session pairs.
* **Smart Contracts:** Solidity contract implementing deposits, locks, releases, refunds, and arbitration (deployed and unit-tested).
* **Network RPC Integration:** Real-time SDA balance query and native SDA coin transfers via Wagmi hooks.
* **Dual Execution Mode:** Simple simulation toggle allowing developers/users to toggle between REST API DB-simulation and live smart contract execution.
* **KYC Integration & Bypass:** Support for OIDC authentication via KYCPort, with a built-in `KYC_BYPASS` development mode for fast local verification.
* **Token Price Bridge:** API routes (`/api/token/list`, `/api/token/metrics`, `/api/token/history`) mapping to Sidra Chain's block explorer API (`ledger.sidrachain.com/api/v2/stats`) for live market cap and historical trends.
* **CMS panel:** Administrative CRUD panel for announcements and banner advertisement management.
* **CI/CD Pipelines:** GitHub Actions validating typescript builds and deploying client/server services.
* **Docker Environment:** Ready-to-run Docker Compose environment mapping Next.js frontend, NestJS API, and PostgreSQL databases.

---

## Out of Scope (Future Releases)

* **Decentralized Disputes (DAO):** Multi-party dispute resolution using decentralized arbitration courts (e.g. Kleros-style integrations) instead of a single arbitrator role.
* **Multi-Chain Support:** Cross-chain escrow bridging (e.g. Ethereum, Solana, Arbitrum).
* **Automated Token Swaps:** Automated on-chain swaps, pending the launch of a stable, liquid AMM DEX router on Sidra Chain mainnet.
* **ERC-4337 Account Abstraction:** Smart account integrations, pending native Sidra Chain gas sponsorship and bundler support.
* **RWA Tokenization:** Layer-3 Real World Asset tokenization frameworks.
