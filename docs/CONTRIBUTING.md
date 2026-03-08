# Contribution Guidelines

We welcome contributions to ByReiXwift—ensuring our Shariah-compliant payment system remains robust and high-quality. All contributors must follow these standards.

## Branch Strategy

We use a structured branching model to maintain project stability.

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code. Always stable. |
| `dev` | Integration branch for all features. |
| `feature/*` | Development of new features. |
| `fix/*` | Maintenance and bug fixes. |
| `hotfix/*` | Critical production resolutions. |

## Workflow

1. **Initialization**: Create a feature branch from latest `dev`.
2. **Implementation**: Commit changes with clear, descriptive messages.
3. **Verification**: Submit a Pull Request to `dev`.
4. **Integration**: Merge only after peer review and manual validation.

## Naming Conventions

- Features: `feature/short-description`
- Bug fixes: `fix/short-description`
- Documentation: `docs/short-description`

## Quality Standards

- **Stability**: Never push directly to `main`.
- **Review**: Every commit must undergo a Pull Request review.
- **Cleanliness**: Delete local and remote branches immediately after successful merging.
- **Definition of Done**: Adhere to all criteria in the project's [Definition of Done](./DOD.md).