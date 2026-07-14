# Technical Stack Specifications

## Frontend Architecture (`/client`)

The frontend application uses the following libraries:

- **Framework**: Next.js (App Router) for routing and server-rendered components.
- **Language**: TypeScript for static type checking.
- **Styling**: Tailwind CSS for component interface styling.
- **State Management**: Zustand for global client-side state.
- **Data Queries**: React Query for backend request caching.
- **Blockchain Interface**: Wagmi and Viem for RPC client interactions.

## Backend Infrastructure (`/server`)

The server application uses the following framework elements:

- **Framework**: NestJS for server-side modular architecture.
- **Runtime**: Node.js.
- **ORM**: Drizzle ORM managing SQL queries and migrations.
- **Database**: PostgreSQL database.
- **Blockchain Integration**: `ContractService` utilizing Viem clients to poll contract events.

## Smart Contracts (`/contracts`)

The contract development suite uses the following tools:

- **Language**: Solidity (version `^0.8.20`) for smart contract source code.
- **Framework**: Hardhat for local compilation, testing, and deployment scripts.

## Auxiliary Development Tools

- **Package Manager**: pnpm for dependency management.
- **Linting & Formatting**: ESLint and Prettier for code consistency.
