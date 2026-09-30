---
name: component-discovery
description: Create specs/<story id>/component-map.json from ui-contract.json using src/components/COMPONENT_CATALOG.md. Prefer reuse of Form*, ActionButtons, DataTable, layout chrome. Avoid duplicate UI. Use after analyze-ui-requirement.
---

# Component Discovery

Canonical twin: `.github/skills/component-discovery/SKILL.md`.

Input: `ui-contract.json` plus `src/components/COMPONENT_CATALOG.md`.

1. Convert each field/action to a UI capability without rereading raw requirement sources.
2. Use the catalog as a low-token first-pass index.
3. Inspect only candidate components and real usages under `src/components`.
4. Choose one of `reuse`, `configure`, `compose`, `extend`, `new-shared`, `page-specific`.
5. Record each decision in `specs/<STORY-ID>/component-map.json`.

Each mapping includes requirement ID, capability, selected component name + path, decision, rationale, and useful evidence usages.

## Path rules

- `reuse` and `configure` must name a catalog export whose `path` is under `src/components` (`form/`, `common/`, `layout/`, `table/`) and exists on disk. Not `src/components/screens/`.
- `compose` must include at least one catalog export. Page-specific files may appear as additional components under `src/modules/<FUNCTION_KEY>/`.
- New pages are `page-specific` at `src/modules/<FUNCTION_KEY>/<Name>Page.tsx` with `<Name>.styles.ts` and `index.ts` (S&G §5).
- `new-shared`, `extend`, and `page-specific` require a rationale (why reuse/composition was not enough).

Do not select raw MUI `Button`, `TextField`, `Select`, `Table`, `IconButton`, or `Dialog` when a catalog wrapper exists.

```bash
npm run component-map:validate -- <STORY-ID>
```
