# Contribution Guidelines Cheat Sheet

This document outlines the standard workflow and naming conventions.
For detailed contribution rules, read the [Contribution Guidelines](./docs/CONTRIBUTING.md).

## Branch Naming Conventions

Prefix your branch names using one of the following schemas:

- `feature/<short-description>` (e.g., `feature/wallet-connect`)
- `fix/<short-description>` (e.g., `fix/navbar-alignment`)
- `hotfix/<short-description>` (e.g., `hotfix/login-crash`)
- `docs/<short-description>` (e.g., `docs/update-readme`)

## Commit Message Conventions

Format commit messages using the following structure:
`<type>: <description>`

Use one of the following commit types:

- `feature`: Implementation of a new feature.
- `fix`: Resolution of a bug or regression.
- `docs`: Documentation edits.
- `refactor`: Structural changes that do not alter code behavior.

Example:
`feature: add transaction status listener`

## Pull Request Rules

- Do not commit secrets or private keys to the repository.
- Do not push commits directly to the `main` branch.
- Target all Pull Requests to the `dev` branch.
- Verify changes locally before submitting a Pull Request.