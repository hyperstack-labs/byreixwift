# Byreixwift

## What Is This

A clean, escrow-first web app for fixed-fee transactions on Sidrachain. The current product direction is a modern JS/TS stack with Next.js on the frontend, a Node/NestJS API, and a Solidity escrow contract.

## Target Users

- Buyers and sellers who need a simple escrow flow for Sidrachain transactions
- Web3 users who want clear transaction states without extra platform complexity
- Future HyperStack ecosystem users who need a safer payment and release flow

## Design Direction

- Dark theme with green accent
- Clean and clutter-free
- Professional look
- Mobile-friendly

---

## MVP (Minimum Viable Product)

### Included

- [ ] Landing page with project overview
- [ ] Wallet connection flow for Sidrachain-compatible wallets
- [ ] Escrow creation flow with amount, fee, buyer, and seller metadata
- [ ] Escrow lifecycle states: pending, locked, released, refunded
- [ ] Mock API flow that mirrors the contract lifecycle for frontend testing
- [ ] Smart escrow contract v0 with deposit, lock, release, and refund
- [ ] Responsive design (works on mobile)

### Not Included (for later)

- Dispute resolution and arbitration
- Multi-party or milestone escrow
- Multi-chain support (ETH, Solana, zkSync - planned but not MVP)
- Account verification / KYC flow
- Notifications
- Full database-backed production ledger and admin tooling

---

## Tech Stack

- **Frontend**: Next.js, TypeScript
- **Styling**: Tailwind CSS (dark green theme)
- **Backend**: Node.js, NestJS
- **Database**: PostgreSQL (planned for production persistence)
- **Contracts**: Solidity, Hardhat

## Reference

UI inspiration based on provided mockups - dark mode, green accents, wallet dashboard style.
