---
inclusion: always
---

# Spec-driven UI

This repo uses a three-phase UI workflow. Do not skip the contract. Do not create `.kiro/specs/` or `top-ui-spec-workflow/specs/` for Function Key screens. Use the shared specs root: `TOP_UI_SPEC_ROOT/<ID>/`, normally `../top-spec-workflow/specs/<ID>/`.

```text
Confluence URL or Function Key → top-spec-workflow `feature:fetch` (UX Design screens only)
 → grill.md (developer agree)
 → UI Requirement Analyst → ui-contract.json
 → UI Architect → component-map.json + src/components/screens/<SCREEN_ID>
 → UI Reviewer → review.md
```

In **Kiro**, switch to the matching custom agent (or stay on the default agent and follow this pipeline):

- **UI Requirement Analyst** — Phase 0 grill + Phase 1 contract
- **UI Architect** — component map + React screen
- **UI Reviewer** — `review.md` only

- `src/components` is the approved library. Read `src/components/COMPONENT_CATALOG.md` before adding UI.
- Do not create `src/comp` or a second component kit.
- Keep `ui-contract.json` (requirements) separate from `ScreenManifest` / `CrudConfig` (runtime).
- Never invent validation, permissions, API behavior, or field constraints. Unknowns stay in `openQuestions`.
- Hierarchy: reuse → configure → compose → backward-compatible extension → new shared → page-specific.
- Prefer existing wrappers (`FormTextField`, `PageHeader`, `TopTable`, `ConfirmDialog`, `SaveButton`) over raw MUI controls in pages. New generated pages: `src/modules/<FUNCTION_KEY>/<Name>Page.tsx`, `<Name>.styles.ts`, and `index.ts`; services use `src/services/<FUNCTION_KEY>Service.ts`. `ui:guard` forbids MUI `Button`/`TextField`/`Select`/`Table`/`IconButton`/`Dialog` in governed module code except documented `allowFiles`.
- Validate with `npm run feature:validate -- <ID>`, `npm run component-map:validate -- <ID>`, `npm run ui:guard`, or `npm run ui:harness -- <ID>`.
- Hooks: Copilot `.github/hooks/`; Cursor `.cursor/hooks.json`; Kiro `.kiro/hooks/` (same `scripts/agent-*-tool-use.mjs` gates).
- Phases: `../top-spec-workflow/specs/guides/PHASE-0.md`, `PHASE-1.md`, `PHASE-2.md`.
#[[file:../top-spec-workflow/specs/guides/PHASE-0.md]]
#[[file:../top-spec-workflow/specs/guides/PHASE-1.md]]
#[[file:../top-spec-workflow/specs/guides/PHASE-2.md]]
#[[file:src/components/COMPONENT_CATALOG.md]]
