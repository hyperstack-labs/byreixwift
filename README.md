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

Ensure you have the following software installed:

- Node.js (LTS version)
- pnpm

### Install Dependencies

Run the following commands to install dependencies across all workspace modules:

```bash
cd server && pnpm install
cd ../client && pnpm install
cd ../contracts && pnpm install
```

### Configure Environment Variables

Create `.env` configuration files inside the `/server` and `/contracts` directories.
Use the respective `.env.example` files as templates.

Ensure the following configuration values are set:

| Key | Value | Description |
| :--- | :--- | :--- |
| `CHAIN` | `SIDRA` | Target blockchain network |
| `CHAIN_ID` | `97453` | Sidrachain Chain ID |
| `NETWORK_ID` | `97453` | Sidrachain Network ID |
| `SIDRACHAIN_RPC_URL` | `https://node.sidrachain.com` | RPC Endpoint URL |
| `EXPLORER_URL` | `https://ledger.sidrachain.com` | Block Explorer URL |
| `DEPLOYER_WALLET_PRIVATE_KEY` | `<private_key>` | Deployer private key |

### Compile and Test Smart Contracts

Run the compiler and execution test suite:

```bash
cd contracts
pnpm hardhat compile
pnpm hardhat test
```

### Deploy Smart Contracts

Deploy the escrow contract to your target network environment:

```bash
cd contracts

# Deploy to a local Hardhat node
pnpm deploy:local

# Deploy to the SidraChain mainnet
pnpm deploy:sidrachain
```

### Run the Applications

Start the backend API service:

```bash
cd server
pnpm dev
```
The API service runs at `http://localhost:3001/api`.

Start the frontend client:

```bash
cd client
pnpm dev
```
The client application runs at `http://localhost:3000`.

---

## Technical Specifications and Guidelines

Refer to the following resources for development policies:

- [Project Scope](./docs/PROJECT.md)
- [Contribution Guidelines](./docs/CONTRIBUTING.md)
- [Definition of Done](./docs/DOD.md)
- [Team Members](./docs/MEMBERS.md)
