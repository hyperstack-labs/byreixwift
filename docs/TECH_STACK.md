# Technical Stack Specifications

## Frontend (`/client`)

| Tool | Version | Purpose |
|---|---|---|
| Next.js | ^16.2 | React framework (App Router) |
| React | ^19.2 | UI library |
| TypeScript | ^5.9 | Static typing |
| Tailwind CSS | ^4.2 | Styling |
| Zustand | ^5.0 | Client-side state management |
| TanStack React Query | ^5.100 | Server state & caching |
| Wagmi | ^3.6 | Ethereum interaction hooks |
| Viem | ^2.48 | Low-level EVM interaction |
| Framer Motion | ^12.38 | Animations |
| Recharts | ^3.8 | Token price charts |
| Radix UI | ^1.x | Accessible UI primitives |
| Sonner | ^2.0 | Toast notifications |
| Lucide React | ^0.577 | Icons |
| SIWE | ^3.0 | Sign-In with Ethereum |
| Zod | ^4.4 | Schema validation |
| Axios | ^1.16 | HTTP client |
| Vitest | ^4.1 | Testing |
| Testing Library | ^14.x | Component testing |

## Backend (`/server`)

| Tool | Version | Purpose |
|---|---|---|
| NestJS | ^11.1 | HTTP framework |
| TypeScript | ^5.9 | Static typing |
| Drizzle ORM | ^0.45 | Type-safe SQL ORM |
| PostgreSQL | 16 | Database |
| Viem | ^2.52 | Blockchain interaction |
| SIWE | ^3.0 | SIWE verification |
| JSON Web Token | ^9.0 | Auth tokens |
| Class Validator | ^0.14 | DTO validation |
| Jest | ^30.4 | Testing |
| TS Jest | ^29.4 | TypeScript Jest transformer |

## Smart Contracts (`/contracts`)

| Tool | Version | Purpose |
|---|---|---|
| Solidity | ^0.8.20 | Smart contract language |
| Hardhat | ^2.28 | Development environment |
| OpenZeppelin | ^5.6 | ReentrancyGuard |
| Ethers | ^6.16 | Ethereum library |
| Chai | ^4.5 | Assertion library |

## DevOps

| Tool | Purpose |
|---|---|
| pnpm | Package manager (workspaces) |
| ESLint | Code linting |
| Prettier | Code formatting |
| GitHub Actions | CI/CD (lint, build, deploy to Vercel) |
| Docker / Docker Compose | Containerization |
| Vercel | Production hosting (client + serverless API) |
