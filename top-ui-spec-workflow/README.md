# TOP UI Spec Workflow

Private UI-specific workflow repository for consuming agreed requirements from `top-spec-workflow` and validating the React application in `top-ui`.

## Repository naming

The workflow repositories are:

```text
top-spec-workflow       # shared DR, contracts, traceability, and acceptance artifacts
top-ui-spec-workflow    # React-specific agents, component maps, and UI validation
top-api-spec-workflow   # Java/API-specific agents, API contracts, and Java validation
```

Shared DR artifacts and Phase 0 commands are maintained in `top-spec-workflow`. API contracts and Java-specific workflow are maintained in `top-api-spec-workflow`.

## Repository boundary

This repository contains UI contracts, component maps, UI agent configuration, and React validation scripts. Shared DR exports and technology-neutral requirements belong in `top-spec-workflow`. React implementation remains in the `top-ui` application repository.

## Local setup

Set `TOP_UI_APP_ROOT` to the absolute path of the checked-out `top-ui` repository before running UI validation:

```powershell
$env:TOP_UI_APP_ROOT = "C:\Users\<name>\toyota_repos\top-ui"
$env:TOP_UI_SPEC_ROOT = "C:\Users\<name>\toyota_repos\top-spec-workflow\specs"
npm install
npm run feature:validate -- WCRM010203
npm run component-map:validate -- WCRM010203
npm run screen:generate -- WCRM030103
npm run ui:guard
```

`TOP_UI_SPEC_ROOT` must point to the shared `top-spec-workflow\specs` directory. Run `feature:fetch`, `feature:init`, and `feature:grill` from `top-spec-workflow`; this repository owns only UI contract, component-map, generation, and validation commands.

## Contract boundary

The normalized UI contract is stored under `TOP_UI_SPEC_ROOT\<FUNCTION_KEY>\ui-contract.json`. API-specific contracts are stored beside it and are governed by `top-api-spec-workflow`.

## Project UI Review Standard

Use [docs/UI_REVIEW_CHECKLIST.md](docs/UI_REVIEW_CHECKLIST.md) for the complete project-wide standard. For a focused manual review, use [docs/UI_MANUAL_REVIEW_CHECKLIST.md](docs/UI_MANUAL_REVIEW_CHECKLIST.md). Feature-specific findings belong in `TOP_UI_SPEC_ROOT\<FUNCTION_KEY>\review.md`.

## Generated application structure

Screen generation writes into the application identified by `TOP_UI_APP_ROOT`:

```text
top-ui/
	src/modules/<FUNCTION_KEY>/<PascalCase>Page.tsx
	src/modules/<FUNCTION_KEY>/<name>.styles.ts
	src/modules/<FUNCTION_KEY>/index.ts
	src/services/<FUNCTION_KEY>Service.ts
```

The generator consumes the agreed `ui-contract.json` and `component-map.json`. It does not generate tests. Each contract must provide an explicit `screen.route` and a non-empty `screen.api` array, including `id`, `method`, `path`, and `mockResponse`. API paths are copied only when explicitly present in the contract; the generator does not invent endpoints.

Generation also updates the app's generated route/module registries and generated MSW handlers. The existing router, module registry, and handler export consume those generated registries automatically.
