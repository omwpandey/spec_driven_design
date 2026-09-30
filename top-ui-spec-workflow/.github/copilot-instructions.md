# Project Copilot Instructions

This React repository uses a staged feature workflow in VS Code + GitHub Copilot.

## Spec root convention

Feature artifacts live in the shared specs repository, not inside `top-ui-spec-workflow`.
In these instructions, `specs/<FUNCTION_KEY>/...` means `TOP_UI_SPEC_ROOT/<FUNCTION_KEY>/...`, normally `../top-spec-workflow/specs/<FUNCTION_KEY>/...`.
Do not create or depend on a local `top-ui-spec-workflow/specs/` folder.

## 0. Fetch + grill (before any contract or React)

Full runbook: [specs/guides/PHASE-0.md](../../top-spec-workflow/specs/guides/PHASE-0.md).

Confluence DR URL or Function Key (example: `WCRM020104`). No Jira MCP. Fetch derives the Function Key from the page when only a URL is given. Do not require `agenticDR` in the title.

```bash
cd ../top-spec-workflow
npm run feature:fetch -- --url "<DR_URL>"
npm run feature:fetch -- <FUNCTION_KEY>
```

Review `specs/<FUNCTION_KEY>/grill.md`. Agree before continuing:

```bash
npm run feature:grill -- <FUNCTION_KEY> --agree --by "<name>"
```

Do not write `ui-contract.json` or implement UI until `grill.json` status is `agreed`.

Use agents **UI Requirement Analyst** → **UI Architect** → **UI Reviewer**. Default Copilot Agent must still follow this pipeline.

Workspace hooks in `.github/hooks/` (Copilot), `.cursor/hooks.json` (Cursor), and `.kiro/hooks/` (Kiro) enforce path, grill, and `ui:guard` rules. Enable **Chat: Use Custom Agent Hooks** in user settings for Copilot agent-scoped write guards (do not commit `.vscode/`). Kiro twins of these agents live in `.kiro/agents/`.

```bash
npm run ui:harness -- <FUNCTION_KEY>
```

## 1. Normalize requirements

Runbook: [specs/guides/PHASE-1.md](../../top-spec-workflow/specs/guides/PHASE-1.md).

Local fetched material becomes:

```text
specs/<FUNCTION_KEY>/raw/
specs/<FUNCTION_KEY>/grill.md
specs/<FUNCTION_KEY>/ui-contract.json
specs/<FUNCTION_KEY>/feature.md
specs/<FUNCTION_KEY>/sources.md
```

Keep `ui-contract.json` separate from `ScreenManifest` and `CrudConfig`.

## 2. Map components

```text
specs/<FUNCTION_KEY>/component-map.json
```

`reuse` / `configure` must name exports from `src/components/COMPONENT_CATALOG.md`.

## 3. Implement

Runbook: [specs/guides/PHASE-2.md](../../top-spec-workflow/specs/guides/PHASE-2.md).

`exceljs` is a fetch-tool devDependency only. Do not import it from `src/`.

`src/components` is authoritative. Read `src/components/COMPONENT_CATALOG.md`.

Reuse existing wrappers (`FormTextField`, `PageHeader`, `DataTable`, `ConfirmDialog`, `SaveButton`, …). Do not introduce `src/comp`.

Generated pages go in `src/modules/<FUNCTION_KEY>/<Name>Page.tsx` with `<Name>.styles.ts` and `index.ts`. Services go in `src/services/<FUNCTION_KEY>Service.ts`. Do not catalog pages.

In `src/demoModules`, `src/modules`, and `src/components/screens`, do not import MUI `Button`, `TextField`, `Select`, `Table`, `IconButton`, or `Dialog`. `Box`, `Grid`, `Stack`, and `Typography` are allowed. `npm run ui:guard` fails otherwise unless the file is a documented `allowFiles` exception.

```text
reuse → configure → compose → extend safely → new shared → page-specific
```

## 4. Review

Reviewer writes only `specs/<FUNCTION_KEY>/review.md`. FAIL unused catalog mappings replaced by raw MUI.

## Critical rules

- Never invent requirements.
- Never silently resolve source conflicts.
- Do not reread Confluence during implementation.
- Do not create parallel UI infrastructure.
- Keep pages thin.
- Preserve shared component defaults.
