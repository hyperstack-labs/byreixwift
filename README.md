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
cd ..\client && pnpm install
cd ..\contracts && pnpm install
```

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
