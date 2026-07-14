# ByReiXwift

ByReiXwift is a decentralized escrow service built on Sidrachain.
The application implements a fixed-fee billing mechanism and a deterministic escrow state machine.

## Architecture and Technical Stack

The system consists of three main modules:

- **Frontend Client (`/client`)**: A web application built with Next.js and TypeScript.
- **Backend Service (`/server`)**: A REST API built with NestJS, PostgreSQL, and Drizzle ORM.
- **Smart Contracts (`/contracts`)**: Solidity contracts developed using Hardhat.

For detailed specifications, read the [Technical Stack](./docs/TECH_STACK.md) and [Backend Architecture](./docs/BACKEND_ARCHITECTURE.md).

## Set Up the Development Environment

### Prerequisites

- Node.js 22.x
- pnpm
- PostgreSQL (for the backend service)

### Install Dependencies

Each workspace has its own `package.json`. Install dependencies for each:

```bash
cd contracts && pnpm install
cd ../server && pnpm install
cd ../client && pnpm install
```

### Configure Environment Variables

Copy `.env.example` to `.env` in each workspace:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
cp contracts/.env.example contracts/.env
```

**Server (`server/.env`):**

| Key | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes | — | Secret for signing JWT access tokens |
| `PORT` | No | `3001` | HTTP listen port |
| `RPC_URL` | Only for on-chain | — | Sidrachain JSON-RPC endpoint |
| `CONTRACT_ADDRESS` | Only for on-chain | — | Deployed `ByReiXwiftEscrow` contract address |

**Client (`client/.env.local`):**

| Key | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Yes | — | Escrow contract address (exposed to browser) |
| `NEXT_PUBLIC_SIDRA_API_URL` | No | `http://localhost:3001/api` | Backend API URL for token/trend data |

**Contracts (`contracts/.env`):**

| Key | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PRIVATE_KEY` | For deployment | — | Deployer wallet private key |
| `CONTRACT_ADDRESS` | After deploy | — | Deployed contract address |
| `RPC_URL` | No | `http://127.0.0.1:8545` | Hardhat node or Sidrachain RPC |

### Compile and Test Smart Contracts

```bash
cd contracts
pnpm compile
pnpm test
```

### Deploy Smart Contracts

```bash
cd contracts

# Deploy to a local Hardhat node (requires `npx hardhat node` running)
pnpm deploy:local

# Deploy to the SidraChain mainnet (requires funded PRIVATE_KEY in .env)
pnpm deploy:sidrachain
```

### Run the Applications

Start PostgreSQL, then:

```bash
cd server
pnpm dev
```
The API service runs at `http://localhost:3001/api`.

```bash
cd client
pnpm dev
```
The client application runs at `http://localhost:3000`.

### Run Tests

```bash
# Contracts (Hardhat)
cd contracts && pnpm test

# Server (Jest)
cd server && pnpm test

# Client (Vitest)
cd client && pnpm test
```

### Docker (Optional)

```bash
docker compose up
```

Starts PostgreSQL, the NestJS server, and the Next.js client.

---

## Technical Specifications and Guidelines

- [Project Scope](./docs/PROJECT.md)
- [Contribution Guidelines](./docs/CONTRIBUTING.md)
- [Definition of Done](./docs/DOD.md)
- [Team Members](./docs/MEMBERS.md)
- [SidraChain Integration](./docs/SIDRA_INTEGRATION.md)
- [Backend Architecture](./docs/BACKEND_ARCHITECTURE.md)
