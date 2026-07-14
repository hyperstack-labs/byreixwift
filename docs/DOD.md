# Definition of Done

A task is complete only when all the following conditions are met:

## 1. Code Quality

- Write code that satisfies the feature requirements.
- Ensure the changes generate no console warnings or errors.
- Follow code style policies, including naming conventions and explicit typing.

## 2. Verification and Testing

- Perform manual verification of the updated feature.
- Run all existing tests (`pnpm test` in client, server, and contracts) — zero failures required.
- Add new tests for any new functionality where applicable.
- Ensure the changes cause no regressions in existing codebase functionalities.

## 3. Code Review

- Obtain at least one peer approval on the Pull Request.

## 4. Documentation and Version Control

- Add comments explaining any complex or non-obvious code paths.
- Update relevant Markdown documentation and README files if needed.
- Write clear and descriptive commit messages following project standards.
- Merge the branch into target integration paths and close the respective issue.