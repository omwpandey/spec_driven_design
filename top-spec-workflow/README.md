# TOP Spec Workflow

Private shared specification repository for Toyota TOP features.

## Purpose

This repository is the source of truth for requirement material that may be consumed by both the React and Java applications. It stores the original DR evidence, human-agreed scope, traceability, shared acceptance criteria, and technology-neutral decisions.

## Repository layout

```text
 top-spec-workflow/
 ├── specs/
 │   └── <FUNCTION_KEY>/
 │       ├── raw/              # Confluence exports, images, spreadsheets
 │       ├── grill.json        # Developer agreement status
 │       ├── grill.md          # Reviewable scope summary
 │       ├── sources.md        # Traceability to source material
 │       ├── requirements.md   # Business requirements
 │       ├── design.md         # Shared design decisions
 │       ├── tasks.md           # Shared implementation tasks
 │       ├── acceptance.md     # Shared acceptance criteria
 │       ├── decisions.md      # ADRs
 │       └── feature.md        # Feature summary
 └── README.md
```

Technology-specific contracts do not belong here. They live in the corresponding workflow repository:

- `top-ui-spec-workflow`: `ui-contract.json`, `component-map.json`, React validation, UI agents.
- `top-api-spec-workflow`: `api-contract.json`, Java validation, Java generation guidance, API tests.

## Workflow

1. From this repository, fetch the published DR into `specs/<FUNCTION_KEY>/raw/` with `TOP_SPEC_ROOT`.
2. Review the generated grill pack with the team.
3. Record agreement in `grill.json` before creating implementation contracts.
4. Normalize only facts supported by the DR into shared artifacts.
5. Create and validate UI/API contracts in their technology-specific repositories.
6. Implement in `top-ui` and the Java application repository.

The shared Phase 0 commands belong to this repository:

```powershell
Push-Location top-spec-workflow
$env:TOP_SPEC_ROOT = "${PWD}\specs"
npm install
npm run feature:fetch -- --url "<DR_URL>"
Pop-Location
```

For the complete sequential runbook, including the VS Code agent commands and validation gates, see [END_TO_END_GUIDE.md](./END_TO_END_GUIDE.md).

Do not place application source code, generated Java code, or React code in this repository.

## Local paths

The workflow repositories are expected beside the application repositories:

```text
C:\Users\<name>\toyota_repos\top-spec-workflow
C:\Users\<name>\toyota_repos\top-ui-spec-workflow
C:\Users\<name>\toyota_repos\top-api-spec-workflow
C:\Users\<name>\toyota_repos\top-ui
C:\Users\<name>\toyota_repos\apis\top-spring-boot-starter
```
