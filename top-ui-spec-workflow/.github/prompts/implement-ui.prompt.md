---
name: implement-ui
description: Implement the agreed UI contract for a Function Key using src/components. Requires grill agreed, ui-contract.json, and component-map.json.
argument-hint: Story ID=<id>
target: vscode
---

# Implement UI

Select the **UI Architect** agent.

Read `ui-contract.json` and `component-map.json` from `TOP_UI_SPEC_ROOT/<STORY-ID>/`, normally `../top-spec-workflow/specs/<STORY-ID>/`.

Follow [specs/guides/PHASE-2.md](../../../top-spec-workflow/specs/guides/PHASE-2.md). Use skills `component-discovery` (if the map is missing) then `build-react-page`.

Do not reread Confluence. Do not invent validation or copy. Put the new page in `src/modules/<FUNCTION_KEY>/<Name>Page.tsx`, its styles in `<Name>.styles.ts`, and its API service in `src/services/<FUNCTION_KEY>Service.ts`. Follow S&G §5 naming in `.github/instructions/react.instructions.md`. Do not import MUI `Button`, `TextField`, `Select`, `Table`, `IconButton`, or `Dialog` in page code.

```bash
npm run feature:validate -- <STORY-ID>
npm run component-map:validate -- <STORY-ID>
npm run ui:guard
```
