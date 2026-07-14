# ByReiXwift

<p align="center">
  <img src="client/public/logo_transparent.png" alt="ByReiXwift Logo" width="250" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Network-Sidra%20Chain%20(97453)-4CAF50" alt="Sidra Chain Network" />
  <img src="https://img.shields.io/badge/Solidity-%5E0.8.20-363636" alt="Solidity Version" />
  <img src="https://img.shields.io/badge/Next.js-15-000000" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-11-E0234E" alt="NestJS" />
  <img src="https://img.shields.io/badge/License-MIT-2196F3" alt="License" />
</p>

ByReiXwift is a decentralized escrow service built on Sidra Chain. The application implements a fixed-fee billing mechanism, smart-contract-level dispute arbitration, and a deterministic escrow state machine.

---

## System Architecture

The project is structured as a pnpm monorepo containing three main workspaces:

* **Frontend Client (`/client`)**: Next.js App Router application built with React, TypeScript, Tailwind CSS, and Wagmi/Viem.
* **Backend Service (`/server`)**: NestJS REST API using Drizzle ORM (PostgreSQL) and a public Viem client to verify on-chain events.
* **Smart Contracts (`/contracts`)**: Solidity contracts developed, compiled, and tested using Hardhat.

Detailed design diagrams and guides are located in the `/docs` directory:
* [Backend Architecture](./docs/BACKEND_ARCHITECTURE.md)
* [Sidra Chain Integration Guide](./docs/SIDRA_INTEGRATION.md)
* [Project Scope](./docs/PROJECT.md)
* [Contribution Guidelines](./docs/CONTRIBUTING.md)

---

## Development Environment Setup

### Prerequisites
* Node.js 22.x
* pnpm (Workspace package manager)
* PostgreSQL (Running instance for the backend service)

### 1. Install Dependencies
Install dependencies for all workspaces at once from the root directory:
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy the `.env.example` configurations to their active filenames:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
cp contracts/.env.example contracts/.env
```

#### Server Configuration (`server/.env`)
| Key | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Yes | — | PostgreSQL connection URI |
| `JWT_SECRET` | Yes | — | Secret token for signing SIWE JWT sessions |
| `PORT` | No | `3001` | Server HTTP port |
| `RPC_URL` | No | — | Sidra Chain JSON-RPC node URL |
| `CONTRACT_ADDRESS` | No | — | Deployed ByReiXwiftEscrow smart contract address |
| `KYC_BYPASS` | No | `false` | Set to `true` to auto-verify KYC via mock routing locally |
| `FRONTEND_URL` | No | `http://localhost:3000` | Redirect callback destination for OAuth/OIDC flows |

#### Client Configuration (`client/.env.local`)
| Key | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Yes | — | Active escrow smart contract address |
| `NEXT_PUBLIC_SIDRA_API_URL` | No | `http://localhost:3001/api` | Target backend REST API URL |
| `NEXT_PUBLIC_USE_MOCK` | No | `false` | Set to `true` to skip contract calls and use UI simulation |

#### Smart Contracts Configuration (`contracts/.env`)
| Key | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PRIVATE_KEY` | For Deploy | — | Deployer/Arbitrator EOA private key |
| `RPC_URL` | No | `https://node.sidrachain.com` | Hardhat provider node or Sidra network RPC |

---

## Running the Application

### Smart Contract Compilation & Tests
Run tests inside the contracts directory to verify safety bounds and arbitrator parameters:
```bash
cd contracts
pnpm compile
pnpm test
```

### Local Smart Contract Deployment
To test live integrations locally, spin up a local Hardhat network:
1. Start the local EVM node:
   ```bash
   cd contracts
   npx hardhat node
   ```
2. In a separate terminal, deploy the contract:
   ```bash
   cd contracts
   pnpm deploy:local
   ```
3. Copy the output contract address to your `client/.env.local` (`NEXT_PUBLIC_CONTRACT_ADDRESS`) and `server/.env` (`CONTRACT_ADDRESS`).

### Running Services Locally
1. Start the backend PostgreSQL database.
2. Launch the backend API server:
   ```bash
   cd server
   pnpm dev
   ```
   The NestJS backend runs at `http://localhost:3001/api` and automatically migrates your Drizzle database schema on boot.
3. Launch the Next.js frontend application:
   ```bash
   cd client
   pnpm dev
   ```
   The client interface runs at `http://localhost:3000`.

---

## Test Suites
You can run automated test suites for each subsystem separately:
```bash
# Smart Contract Tests (Mocha/Chai)
cd contracts && pnpm test

# Backend API Tests (Jest)
cd server && pnpm test

# Frontend Client Tests (Vitest)
cd client && pnpm test
```

### Docker Integration (Optional)
To launch all services (PostgreSQL, NestJS API, and Next.js client) simultaneously in docker containers:
```bash
docker compose up
```

---

## Code Standards
* **No Linting/TSC Checks:** Do not run formatting, linting, or typescript compile-time checks manually in terminal loops unless requested by project administrators.
* **Strict Type Safety:** Ensure all schema expansions and DTO payloads are accompanied by appropriate type interfaces and class-validator decorators.
