# Project Copilot Instructions

GitHub Copilot is the host. The policy is [POLICY.md](../../top-spec-workflow/POLICY.md). Select one UI agent for the step you are on.

## Spec root

Feature artifacts live in the shared specs repository, not inside `top-ui-spec-workflow`.
`specs/<FUNCTION_KEY>/...` means `TOP_UI_SPEC_ROOT/<FUNCTION_KEY>/...`, normally `../top-spec-workflow/specs/<FUNCTION_KEY>/...`.
Do not create a local `top-ui-spec-workflow/specs/` folder.

## Agents

| Agent | Writes |
|---|---|
| UI Requirement Analyst | agreed grill, then `sources.md`, `feature.md`, `ui-contract.json` |
| UI Architect | `component-map.json` |
| UI Developer | `src/modules/<FUNCTION_KEY>/` and `src/services/<FUNCTION_KEY>Service.ts` |
| UI Reviewer | `review.md` |
| Test Script Developer | tests and `test-report.md` |

The API Contract Analyst in `top-api-spec-workflow` writes `api-contract.json` and `contract-map.json` after the grill is agreed. The UI analyst copies `screen.api` from that map.

Workspace hooks in `.github/hooks/` block a write outside the selected agent's files. Enable **Chat: Use Custom Agent Hooks**.

## React rules

`src/components` is authoritative. Read `src/components/COMPONENT_CATALOG.md`.

Generated pages go in `src/modules/<FUNCTION_KEY>/<Name>Page.tsx` with `<Name>.styles.ts` and `index.ts`. Services go in `src/services/<FUNCTION_KEY>Service.ts`.

In `src/demoModules`, `src/modules`, and `src/components/screens`, do not import MUI `Button`, `TextField`, `Select`, `Table`, `IconButton`, or `Dialog`. `Box`, `Grid`, `Stack`, and `Typography` are allowed. `npm run ui:guard` fails otherwise unless the file is a documented `allowFiles` exception.

Naming for new frontend files is in `.github/instructions/react.instructions.md`.

```text
reuse → configure → compose → extend safely → new shared → page-specific
```

## Critical rules

- Never invent requirements.
- Never silently resolve source conflicts.
- Do not reread Confluence during implementation.
- Do not create parallel UI infrastructure.
- Keep pages thin.
- Preserve shared component defaults.
