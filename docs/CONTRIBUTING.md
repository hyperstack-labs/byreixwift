# Contribution Guidelines

Follow these guidelines to develop, test, and submit updates.

## Branching Model

Name and manage branches according to the following conventions:

- `main`: Stores stable release code. Do not commit or push directly to this branch.
- `dev`: Serves as the integration branch for all new changes.
- `feature/*`: Use for developing new features.
- `fix/*`: Use for fixing bugs and regressions.
- `hotfix/*`: Use for applying critical patches to production.

## Development Workflow

Follow this procedure for submitting updates:

1. Create a feature branch originating from the latest commit on `dev`.
2. Commit changes with clear, descriptive commit messages.
3. Open a Pull Request targeting the `dev` branch.
4. Merge changes only after receiving peer approvals and passing manual verification.

## Branch and Commit Conventions

- **Branch format**: `<type>/<short-description>` (e.g., `feature/wallet-connection`).
- **Commit message format**: `<type>: <short description>` (e.g., `fix: resolve status bar alignment`).

## Quality Standards

- **Review Policy**: Ensure all commits pass Pull Request review before merging.
- **Branch Cleanup**: Delete local and remote branches immediately after a successful merge.
- **Testing**: Run all tests before opening a PR — `pnpm test` in `client/`, `server/`, and `contracts/`. Ensure zero failures.
- **Definition of Done**: Verify that all deliverables satisfy the criteria defined in the [Definition of Done](./DOD.md).
