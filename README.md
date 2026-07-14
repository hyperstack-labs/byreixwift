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

Copy `.env.example` to `.env` in `/contracts` and `/server`. Copy or create `client/.env.local` based on the env vars expected by the client.

**Key configuration values:**

| Key | Default | Description |
| :--- | :--- | :--- |
| `CHAIN` | `SIDRA` | Target blockchain network |
| `CHAIN_ID` | `97453` | Sidrachain Chain ID |
| `RPC_URL` | `https://node.sidrachain.com` | RPC Endpoint URL |
| `CONTRACT_ADDRESS` | — | Deployed escrow contract address |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | — | Same address, exposed to the frontend |
| `DATABASE_URL` | — | PostgreSQL connection string |
| `JWT_SECRET` | — | Secret for JWT token signing |

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
