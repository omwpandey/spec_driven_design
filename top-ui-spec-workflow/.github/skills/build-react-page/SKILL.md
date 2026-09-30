---
name: build-react-page
description: Implement a normalized UI feature contract in React using the feature component map and src/components. Use after component-discovery when grill.json is agreed. Do not invent requirements or raw MUI controls.
argument-hint: "[story id]"
---

# Build React Page

Read required spec artifacts from `TOP_UI_SPEC_ROOT/<STORY-ID>/`, normally `../top-spec-workflow/specs/<STORY-ID>/`. Treat `specs/<STORY-ID>/...` below as shorthand for that shared specs root.

Required inputs:

- `specs/<STORY-ID>/grill.json` status `agreed` when a grill file exists
- `specs/<STORY-ID>/ui-contract.json`
- `specs/<STORY-ID>/component-map.json`
- `src/components/COMPONENT_CATALOG.md`

If `grill.json` exists and status is not `agreed`, stop. If a blocking open question would force invented business behavior, stop.

Do not reread Confluence or `raw/`. Do not create `src/comp`.

## Screen location (S&G §5)

New screens:

```text
src/modules/<FUNCTION_KEY>/<PascalCase>Page.tsx
```

Screen-local pieces go in `src/modules/<FUNCTION_KEY>/components/`. Leave existing `*Page.tsx` under `src/demoModules` / `src/modules` as-is. Put the feature service in `src/services/<FUNCTION_KEY>Service.ts`. Do not add screens to `COMPONENT_CATALOG.md`.

Follow `.github/instructions/react.instructions.md` naming: `handle{Event}`, `is`/`has`/`should`, UPPER_SNAKE_CASE constants, `SCREEN_IDS` from the contract Function Key.

## Page shape

Screens should mostly contain:

- imports from `@components/*` catalog wrappers (`form/`, `common/`, `layout/`, `table/`)
- React Hook Form + Yup (only rules that exist on the contract)
- `useApi` / `apiService` for listed APIs (include screen ID in the path when the contract lists a screen-specific API)
- handlers that follow contract actions (`handleSearch`, `handleSave`, …)
- composition of catalog components

Do not put significant business rules in JSX.

## Chrome and forms

| Need | Use |
|---|---|
| Page shell | `PageContainer`, `PageHeader`, `PageFooter`, `SectionCard` |
| Text / number / select / date / checkbox | matching `Form*` wrapper |
| Footer actions | `SaveButton`, `DeleteButton`, `SearchButton`, `ResetButton`, `SecondaryButton`, `ScreenActionBar` |
| Tables | `DataTable` |
| Confirm / alert | `ConfirmDialog`, `AlertDialog` |
| Empty / error / loading | `EmptyState`, `ErrorState`, `LoadingOverlay` |

Layout-only MUI (`Box`, `Grid`, `Stack`, `Typography`) is allowed. Do **not** import `Button`, `TextField`, `Select`, `Table`, `IconButton`, or `Dialog` from `@mui/material` in screen code. Do not add CSS modules.

## Actions

For every contract action implement only what is specified: trigger, frontend validations, validation-failure behavior, the named action, success/failure effects. Discover existing `useApi` and `apiService` instead of inventing clients.

## i18n and routing

- User-visible strings go through translation keys in `src/core/languages/en.ts` and `th.ts`. Do not invent English toast copy when the contract does not specify it; leave a blocking open question.
- Register the page through the generated module and route registries as `@modules/<FUNCTION_KEY>/<Name>Page`.

## Hierarchy

```text
reuse → configure → compose → safely extend → new-shared → page-specific
```

New shared or page-specific UI needs a component-map rationale. Prefer configuring an existing wrapper.

## Validate

```bash
npm run feature:validate -- <STORY-ID>
npm run component-map:validate -- <STORY-ID>
npm run ui:guard
```

Then run the project's lint, typecheck, unit tests, and build scripts that already exist. Do not add new test libraries.
