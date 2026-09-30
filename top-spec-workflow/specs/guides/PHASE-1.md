# Phase 1 — Normalize the contract and map components

This is the **second of three phases**. Phase 1 does **not** write a product page. It turns the agreed grill + `raw/` into `ui-contract.json`, then maps every field/action onto `src/components`.

| Phase | Guide | Outcome |
|---|---|---|
| **0** | [PHASE-0.md](./PHASE-0.md) | `grill.json` status `agreed` |
| **1** | This file | `ui-contract.json` + `component-map.json` |
| **2** | [PHASE-2.md](./PHASE-2.md) | Page + `review.md` |

Use **VS Code + GitHub Copilot**, **Cursor**, or **Kiro**. Stay on **UI Requirement Analyst** until the contract is done, then hand off to **UI Architect** for the component map (or keep Architect for map-only). Do not start `.tsx` until the map exists.

---

## Preconditions

- [PHASE-0.md](./PHASE-0.md) complete: `grill.json` `"status": "agreed"`
- `specs/<FUNCTION_KEY>/raw/` present

If grill is `pending_review` or `rejected`, stop. Hooks will deny `ui-contract.json`, `component-map.json`, and React until agree.

---

## 1. Write the UI contract (Analyst)

Chat → Agents → **UI Requirement Analyst**. Skill: `analyze-ui-requirement`.

```text
Function Key=WCRM020104
grill is agreed. Write the UI contract from raw/ plus grill.md. Do not implement React.
```

Writes only:

```text
specs/<FUNCTION_KEY>/sources.md
specs/<FUNCTION_KEY>/feature.md
specs/<FUNCTION_KEY>/ui-contract.json
```

Rules: extract only what sources support. Conflicts stay in `conflicts`. Unknowns stay in `openQuestions` (`blocking: true` when a business rule would otherwise be invented). Do not pick React components.

```bash
npm run feature:validate -- <FUNCTION_KEY>
```

Must PASS before mapping.

---

## 2. Map components (Architect)

Chat → Agents → **UI Architect**. Skill: `component-discovery`. Stop after the map if you want a second human agree before code.

```text
Story ID=WCRM020104
Create component-map.json from the contract and src/components/COMPONENT_CATALOG.md. Do not implement the page yet.
```

```text
specs/<FUNCTION_KEY>/component-map.json
```

Hierarchy:

```text
reuse → configure → compose → extend → new-shared → page-specific
```

`reuse` / `configure` must name a catalog export under `src/components`. Do not map raw MUI `Button` / `TextField` / `Select` / `Table` / `IconButton` / `Dialog`.

```bash
npm run component-map:validate -- <FUNCTION_KEY>
```

---

## 3. Developer agree the map

Open `component-map.json`. Confirm every field/action has a mapping and that `page-specific` / `new-shared` rationales are real. If the map is wrong, tell Architect what to change. There is no second `feature:grill` flag for the map; agreement is this review.

---

## Phase 1 done when

- [ ] `feature:validate` PASS
- [ ] `component-map:validate` PASS
- [ ] You accept the mapped catalog components
- [ ] Blocking open questions are either resolved as developer-decision sources or left blocking (no invented rules)

Then go to **[Phase 2](./PHASE-2.md)**.
