# Phase 2 — Implement one screen and review

This is the **third of three phases**. Implement only the Function Key you agreed in Phase 0. Use `src/components`. Do not invent requirements.

| Phase | Guide | Outcome |
|---|---|---|
| **0** | [PHASE-0.md](./PHASE-0.md) | `grill.json` status `agreed` |
| **1** | [PHASE-1.md](./PHASE-1.md) | `ui-contract.json` + `component-map.json` |
| **2** | This file | Screen under `src/components/screens/<SCREEN_ID>/` + `review.md` |

Use **VS Code + GitHub Copilot**, **Cursor**, or **Kiro**: **UI Architect**, then hand off to **UI Reviewer**.

---

## Preconditions

- Grill agreed
- `npm run feature:validate -- <ID>` PASS
- `npm run component-map:validate -- <ID>` PASS

If grill is not agreed, hooks will deny `.tsx` writes for that Function Key.

Workspace `ui:guard` runs after UI edits (PostToolUse / Cursor `afterFileEdit` / Kiro `PostToolUse` + `PostFileSave`). Copilot: enable **Chat: Use Custom Agent Hooks** in **user** settings for Analyst/Reviewer/Architect agent-scoped write guards (`.vscode/` is gitignored). Cursor: project hooks in `.cursor/hooks.json` enforce the same Node scripts. Kiro: `.kiro/hooks/ui-governance.json` plus agent-scoped hooks on `.kiro/agents/*`.

Before handoff, run:

```bash
npm run ui:harness -- <FUNCTION_KEY>
```

---

## 1. Implement (Architect)

Skill: `build-react-page`.

```text
Story ID=WCRM020104
Implement from ui-contract.json and component-map.json. Reuse src/components. Do not invent validation or copy.
```

Page rules:

- Location: `src/modules/<FUNCTION_KEY>/<PascalCase>Screen.tsx` (S&G §5). Leave existing `*Page.tsx` as-is.
- Naming: `handle{Event}`, `is`/`has`/`should`, UPPER_SNAKE_CASE constants. See `.github/instructions/react.instructions.md`.
- Chrome: `PageContainer`, `PageHeader`, `PageFooter`, `SectionCard`
- Fields: catalog `Form*` wrappers + React Hook Form / Yup **only** for contract rules
- Actions: `SaveButton`, `SearchButton`, `ResetButton`, `DeleteButton`, `ConfirmDialog`, …
- Data: existing `useApi` / `apiService` for APIs listed on the contract (include screen ID in the path when the contract lists a screen-specific API). `apiService`'s axios instance already has baseURL `/api` — screen `API_PATHS` must **not** repeat the `/api` prefix (e.g. use `/v1/crm/<SCREEN_ID>/...`, not `/api/v1/crm/<SCREEN_ID>/...`), or requests double up and silently miss MSW handlers / fail against the real proxy. Add a matching MSW handler in `src/mocks/handlers.ts` (registered in the `handlers` export) returning representative dummy data for every new API path — dev has no live backend, so an unhandled request fails/flickers instead of rendering. Depend on the stable `execute` function from `useApi` (e.g. `[fooApi.execute]`), never the whole hook return object, in `useCallback` dependency arrays — the object is re-created every render and will cause infinite refetch loops.
- i18n: keys in `src/core/languages/en.ts` and `th.ts`
- Service: `src/services/<FUNCTION_KEY>Service.ts`; use only API paths explicitly present in the contract.
- Route: `src/core/manifest/moduleRegistry.ts` as `@modules/<FUNCTION_KEY>/<Name>Screen` and existing router patterns
- Layout MUI only: `Box`, `Grid`, `Stack`, `Typography`
- Forbidden in screens: MUI `Button`, `TextField`, `Select`, `Table`, `IconButton`, `Dialog`, and raw HTML `<button>` / `<input>` / `<select>` / `<textarea>`
- Do not add CSS modules. Do not catalog screens in `COMPONENT_CATALOG.md`.

As-built exceptions are listed in `ui-governance.config.json` `allowFiles`. Do not copy those patterns into a new screen.

```bash
npm run feature:validate -- <ID>
npm run component-map:validate -- <ID>
npm run ui:guard
```

Then run the repo lint / build scripts that already exist. Test generation is outside this workflow.

---

## 2. Review (Reviewer)

Chat → handoff **Review UI**, or Agents → **UI Reviewer**. Skill: `ui-review`.

The reviewer writes **only**:

```text
specs/<FUNCTION_KEY>/review.md
```

FAIL if a mapped catalog export is unused and the page uses raw MUI instead.

---

## Phase 2 done when

- [ ] Screen renders the contract fields, actions, and states that are not blocked by open questions
- [ ] `ui:guard` PASS (no new `allowFiles` without a written reason)
- [ ] `review.md` verdict is PASS or documented WARNING (FAIL means fix or record a source-backed exception)

Do not start another Function Key in the same implementation pass.
