# TOP Spec Workflow

Private shared specification repository for Toyota TOP features.

## Purpose

This repository is the source of truth for requirement material that may be consumed by both the React and Java applications. It stores the original DR evidence, human-agreed scope, traceability, shared acceptance criteria, and technology-neutral decisions.

## Repository layout

```text
 top-spec-workflow/
 ├── POLICY.md
 ├── specs/
 │   └── <FUNCTION_KEY>/
 │       ├── raw/              # Confluence exports, images, spreadsheets
 │       ├── grill.json        # One agreement: fields, actions, APIs, validations
 │       ├── grill.md          # Readable copy of that agreement
 │       ├── sources.md        # Source ids
 │       ├── feature.md        # One-page summary
 │       ├── ui-contract.json  # Screen contract, including acceptance criteria
 │       ├── api-contract.json # Identified APIs: method, path, examples, validation errors
 │       ├── contract-map.json # UI field or action → API id
 │       ├── component-map.json# React component choices only
 │       ├── review.md         # UI review verdict
 │       └── test-report.md    # UI test result
 └── README.md
```

The policy is [POLICY.md](./POLICY.md). `top-api-spec-workflow` writes `api-contract.json` and `contract-map.json` into this folder. `top-ui-spec-workflow` copies that map into `ui-contract.json` `screen.api`, then the UI Architect writes `component-map.json` and the UI Developer writes the page. React and Java source stay in the application repositories.

## Workflow

Select one agent. [POLICY.md](./POLICY.md) is the runbook.

1. **UI Requirement Analyst** fetches the DR, agrees `grill.json`, and writes `ui-contract.json`.
2. **API Contract Analyst** writes `api-contract.json` and `contract-map.json`. The UI analyst copies `screen.api`.
3. **UI Architect** writes `component-map.json`.
4. **UI Developer** writes the page under `src/modules/<FUNCTION_KEY>/`.
5. **UI Reviewer** writes `review.md`.
6. **Test Script Developer** writes tests and `test-report.md`.

Fetch and agree belong to this repository:

```powershell
Push-Location top-spec-workflow
$env:TOP_SPEC_ROOT = "${PWD}\specs"
npm install
npm run feature:fetch -- --url "<DR_URL>"
Pop-Location
```

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
