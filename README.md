# ByReiXwift

ByReiXwift is an escrow-first Sidrachain product focused on fixed-fee transactions, simple lifecycle states, and a cleaner path toward compliant payment flows.

## Key Principles

The product direction is centered on predictable execution and transparent transaction rules.

- **Fixed Fees**: No hidden charges and no percentage-based surprises.
- **Clear States**: Every escrow should move through simple, auditable lifecycle steps.
- **Progressive Delivery**: We keep the MVP intentionally small before adding broader payment features.

## Documentation and Resources

For detailed information on project operations and technical specifications, refer to the following resources:

- [Technical Stack](./docs/TECH_STACK.md) - Detailed architecture and infrastructure.
- [Contribution Guidelines](./docs/CONTRIBUTING.md) - How to develop and submit changes.
- [Project Scope](./docs/PROJECT.md) - Current product scope and MVP direction.
- [Team Members](./docs/MEMBERS.md) - Project ownership and lead developers.
- [Definition of Done](./docs/DOD.md) - Quality standards for task completion.

## Development Setup

### Prerequisites
- Node.js (Latest LTS)
- pnpm


### Quick Start
```bash
git clone <repository-url>
cd byreixwift
cd server && pnpm install
cd ../client && pnpm install
cd ../contracts && pnpm install
```

### Environment Variables
Each Workspace has its own .env.example file 
/server/.env.example
/contracts/.env.example



## Node.js & Hardhat Setup

### Supported Versions

- **Node.js**: LTS version (recommended)
- **Hardhat**: Latest version defined in `package.json`
- **Package Manager**: pnpm

## Smart Contract Setup
```bash
cd contracts
pnpm install
pnpm hardhat compile
pnpm hardhat test
```

## Test Consistency

Contract tests are expected to:

- Run successfully after installation
- Pass consistently across different machines
- Not depend on local machine configuration

If tests fail, ensure:
```bash
pnpm install
pnpm hardhat clean
pnpm hardhat compile
pnpm hardhat test
```

### Deploy to SidraChain Network

**Details**
Ensure that the following environment variables are inside the .env.example of both /server and /contracts

| KEY | VALUE | 
| -------- | -------- |
| CHAIN | SIDRA |
| CHAIN_ID | 97453 |
| NETWORK_ID | 97453 |
| SIDRACHAIN_RPC_URL | https://node.sidrachain.com |
| INFO_URL | https://www.sidrachain.com |
| EXPLORER_NAME | Sidra Chain Explorer |
| EXPLORER_URL | https://ledger.sidrachain.com |
| EXPLORER_STANDARD | EIP3091 |
| DEPLOYER_WALLET_PRIVATE_KEY | private key of the wallet to be used for deploying | 

Deploy Commands
```bash
cd contracts
# For deploying locally 
pnpm deploy:local

# For deploying to SidraChain mainnet
pnpm deploy:sidrachain
```
**Key note** 

Make sure that the DEPLOYER_WALLET_PRIVATE_KEY is set on the environment variables and has enough SDA for the gas fees

### Run The App

```bash
cd server
pnpm dev
```

```bash
cd client
pnpm dev
```

The client runs at `http://localhost:3000` and the API runs at `http://localhost:3001/api`.





