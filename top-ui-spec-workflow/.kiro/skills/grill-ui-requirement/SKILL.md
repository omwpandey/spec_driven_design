---
name: grill-ui-requirement
description: After fetching a published DR, present the identified screen, fields, actions, and APIs and stop until the developer agrees. Use when the user says grill me, Phase 0, review requirements, feature:fetch, pastes a Confluence URL, or starts a Function Key.
---

# Grill UI requirement

Do not implement React. Do not write `ui-contract.json` until `grill.json` status is `agreed`. Runbook: `../top-spec-workflow/specs/guides/PHASE-0.md`.

Feature artifacts live under `TOP_UI_SPEC_ROOT/<FUNCTION_KEY>/`, normally `../top-spec-workflow/specs/<FUNCTION_KEY>/`. Run Phase 0 commands from `top-spec-workflow`.

Canonical twins: `.github/skills/grill-ui-requirement/SKILL.md` (Copilot), `.cursor/skills/phase-0-grill/SKILL.md` (Cursor). If they disagree with this file on procedure, follow that procedure and keep the Kiro ask rules below.

Kiro has no structured question tool. Ask **one question at a time in chat** and wait. Never pass a guessed `--by` name, `--notes`, `--reason`, or Function Key when a URL is enough. Do not require `agenticDR` in the title.

## Loop

```
Phase 0
- [ ] URL or Function Key
- [ ] feature:fetch
- [ ] grill.md reviewed with developer
- [ ] corrections applied (if any)
- [ ] feature:grill --agree or --reject
- [ ] STOP
```

### 1. Input

Accept either:

- A Confluence URL containing `/pages/<id>`
- A Function Key (example `WCRM010203`)

If the chat has neither, ask: How should Phase 0 start? Options: paste a DR URL, or type a Function Key.

Do not ask for a Jira key.

### 2. Fetch

Prefer URL when the user gave one. The script derives the Function Key from the page title (`[WCRM010203] …`) or URL slug.

```bash
cd ../top-spec-workflow
npm run feature:fetch -- --url "<DR_URL>"
npm run feature:fetch -- "<DR_URL>"
npm run feature:fetch -- <FUNCTION_KEY>
```

| Result | What to do |
|---|---|
| Success | Open `grill.md` and `grill.json`. Continue. |
| Could not derive Function Key | Ask for `--function-key`, then re-run with `--url` and `--function-key`. |
| Page not found (key search) | Ask for the DR URL, then fetch with `--url`. |
| Already fetched, same version | Reuse local `raw/` + `grill.md`. Ask whether to `--force` only if they say the Confluence page changed. |
| Credentials / env error | Show the error. Ask them to fix `.env` / `CONFLUENCE_ENV_FILE`. Do not invent tokens. |

### 3. Present the grill

Read `specs/<KEY>/grill.md` and `raw/page.md`. In chat, show a short summary:

- Function Key (derived or provided)
- Title, version, URL
- **UX Design screens only** (`grill.md` → Screens to build). One mockup = one task. Several mockups = `UX-001`… and one Phase 2 pass each.
- Mode / field / action / API counts
- `missing` (including `UX Design section` or `UX Design screen image`)
- Menu path from the DR vs `src/core/manifest/moduleRegistry.ts` and `src/components/layout/Sidebar.tsx`

Then ask: Is this the task list to build? Options: **Agree** / **Edit** / **Reject** / **Already built**.

### 4. Edit (only if they chose Edit)

Apply only what they stated. Edit `grill.json` → `identified`. Keep `status` `pending_review`. Refresh:

```bash
cd ../top-spec-workflow
npm run feature:grill -- <FUNCTION_KEY>
```

Do not invent a field that is not in `raw/`. Re-ask step 3.

### 5. Reject (only if they chose Reject)

Ask for `--reason` (required). Then:

```bash
cd ../top-spec-workflow
npm run feature:grill -- <FUNCTION_KEY> --reject --reason "<their reason>"
```

Stop. Do not fetch again unless they ask.

### 6. Agree (only if they chose Agree or Already built)

Ask, in order:

1. Your name for `--by` (required).
2. Optional notes (missing workbooks, refresh vs new, out-of-scope items).

Then run exactly what they gave:

```bash
cd ../top-spec-workflow
npm run feature:grill -- <FUNCTION_KEY> --agree --by "<name>"
```

Confirm `grill.json` `"status": "agreed"`.

### 7. Stop

Phase 0 is done. Tell them Phase 1 is contract (`analyze-ui-requirement`) and that you will not start it unless they ask.
