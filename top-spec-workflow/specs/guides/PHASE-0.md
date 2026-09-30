# Phase 0 — Break the DR into tasks and get developer agreement

This is the **first of three phases**. Phase 0 does **not** write React and does **not** write `ui-contract.json`. It only fetches the published Design Requirement, turns it into a task list (`grill.md`), and stops until you review and agree.

| Phase | Name | Outcome |
|---|---|---|
| **0** | Requirement → tasks + agree | `grill.json` status `agreed` |
| **1** | Contract + component map + agree | [PHASE-1.md](./PHASE-1.md) — `ui-contract.json` + `component-map.json` |
| **2** | Implement one screen + review | [PHASE-2.md](./PHASE-2.md) — generated page in `src/modules/<FUNCTION_KEY>/` + `review.md` |

Use **VS Code + GitHub Copilot**, **Cursor**, or **Kiro**. Prefer the **UI Requirement Analyst** agent, or run the commands yourself.

Workspace hooks live in `.github/hooks/` (Copilot PreToolUse + PostToolUse), `.cursor/hooks.json` (Cursor Agent `preToolUse` / `postToolUse` / `afterFileEdit`), and `.kiro/hooks/` (Kiro `PreToolUse` / `PostToolUse` / `PostFileSave`). All call the same Node gates under `scripts/`. They run without extra settings in Cursor once hooks are enabled for the project. Kiro loads `.kiro/hooks/*.json` when a session starts.

Agent-scoped Copilot hooks (Analyst write-guard, Reviewer `review.md` only, Architect pre-gate) need the VS Code preview setting **Chat: Use Custom Agent Hooks** (`chat.useCustomAgentHooks`) enabled **in your user settings**. Do not commit `.vscode/` — that folder is gitignored. Command Palette → **Preferences: Open User Settings** → search `useCustomAgentHooks`.

Cursor Agent does not use Copilot custom-agent identity; it relies on path + grill phase gates in `scripts/agent-pre-tool-use.mjs` (contract/map/src blocked until grill is `agreed`, map required before page code, `src/comp` blocked, `ui:guard` after UI edits). Kiro custom agents in `.kiro/agents/` set `UI_HOOK_AGENT` through `scripts/kiro-pre-tool-use.mjs` and block denied writes with a non-zero exit.

---

## What you need

- Node 22 and repo dependencies (`npm install` once).
- A Confluence **DR URL** (`/pages/<id>`), or a **Function Key** (example: `WCRM020104`). Not a Jira key. Fetch derives the Function Key from the page title (`[WCRM010203] …`) or URL slug when you only pass a URL.
- Confluence credentials already in the DR agent env (do not commit tokens):

```text
CONFLUENCE_ENV_FILE=D:\toyota_crm\crm_dr_gen\dr_creation_agent\.env
```

Copy `.env.example` to `.env` and set `CONFLUENCE_ENV_FILE`, or keep the DR agent `.env` as the sibling file. Keys used: `CONFLUENCE_BASE_URL`, `CONFLUENCE_EMAIL`, `CONFLUENCE_API_TOKEN`.

---

## Steps (run in this order)

### 1. Open the shared spec repo

Run Phase 0 commands from `top-spec-workflow` (this folder, with `package.json`). The resulting artifacts are shared by both UI and API workflows.

### 2. Fetch the published DR

Prefer the Confluence URL. The script reads the page and derives the Function Key:

```bash
cd top-spec-workflow
npm run feature:fetch -- --url "https://tdem.atlassian.net/wiki/spaces/TC1/pages/<id>/..."
```

A bare URL is also valid:

```bash
cd top-spec-workflow
npm run feature:fetch -- "https://tdem.atlassian.net/wiki/spaces/TC1/pages/<id>/..."
```

Search by Function Key when you do not have the URL:

```bash
cd top-spec-workflow
npm run feature:fetch -- WCRM020104
```

If you already fetched and the Confluence page changed, overwrite local raw files:

```bash
cd top-spec-workflow
npm run feature:fetch -- --url "<DR_URL>" --force
```

`--force` resets grill to `pending_review` when the page **version** changed.

### 3. Confirm what landed

You should have:

```text
specs/WCRM020104/raw/page.md          DR body
specs/WCRM020104/raw/ux-design.md     UX Design section only (if present)
specs/WCRM020104/raw/images/          UX Design screen mockups only
specs/WCRM020104/raw/xlsx/            Item_Desc / API / DATA_MAP (if attached)
specs/WCRM020104/raw/sheets/          same workbooks as markdown
specs/WCRM020104/grill.md             task list (UX-001… if several mockups)
specs/WCRM020104/grill.json           machine status (pending_review)
```

The script accepts a URL or searches by Function Key. It does not require `agenticDR` in the title. It does not use Jira MCP.

### 4. Review the task list (grill)

Open `specs/WCRM020104/grill.md`.

Check:

- **UX Design only.** Fetch downloads **only** mockups under the DR **UX Design** heading. Other page images are ignored and not fetched. If UX Design has **one** image, this Function Key is one task. If it has **several**, grill lists `UX-001`, `UX-002`, … and Phase 2 implements **one task per pass**. If the section is missing or has no image, treat that as a gap (do not invent screens from other figures).
- **Already in the product menu?** Compare `raw/page.md` → **Menu Path** with `src/core/manifest/moduleRegistry.ts` and `src/components/layout/Sidebar.tsx`. If the path exists and the page is a real screen (not a stub sharing another route), treat it as **already built** and decide in chat whether this run is a **refresh** or a **new** screen.
- **Latest?** Confirm this Confluence version is the DR you want to build.
- Fields, modes, events, APIs, images, and **Missing** (example: `DATA_MAP_*` not on the page).

Do **not** invent fields to fill gaps. Missing stays missing until the DR or you add a written decision (see modifications below).

### 5. Agree or reject

**Agree** (Phase 0 done):

```bash
npm run feature:grill -- WCRM020104 --agree --by "Your Name"
```

Optional note stored on the agreement:

```bash
npm run feature:grill -- WCRM020104 --agree --by "Your Name" --notes "Proceed as new screen; DATA_MAP out of scope"
```

**Reject** (wrong page or not latest):

```bash
npm run feature:grill -- WCRM020104 --reject --reason "Not the latest DR"
```

Then fetch the correct page (`--url` or republish) and start from step 2.

### 6. Check status anytime

```bash
npm run feature:grill -- WCRM020104
```

`grill.md` header **Status** must be `` `agreed` `` before Phase 1.

`npm run feature:validate -- WCRM020104` will **fail** until grill is agreed (once a contract exists). There is no React in Phase 0.

---

## Small modifications after you see the tasks

Do **not** start Phase 1 until the grill matches what you want. Use the smallest change that fits.

### A. Drop or add a task (same DR, same page version)

1. Tell Copilot (Analyst) exactly what to remove or add, **or** edit `specs/<KEY>/grill.json` → `identified` (fields / actions / modes / apis / missing) yourself.
2. Keep `status` as `pending_review` until you re-agree.
3. If you edit JSON only, refresh the readable list:

```bash
npm run feature:grill -- WCRM020104
```

4. Agree again with a note:

```bash
npm run feature:grill -- WCRM020104 --agree --by "Your Name" --notes "Dropped pagination; DATA_MAP still out of scope"
```

Do not invent a field that is not in `raw/`. If product wants a new rule, write it as a **developer decision** in the note and, in Phase 1, as source `developer-decision-001` on the contract.

### B. DR on Confluence changed (new version)

```bash
npm run feature:fetch -- WCRM020104 --force
```

Review `grill.md` again. Previous agree is cleared when the page version changes. Agree only if the new list is still correct.

### C. Wrong Function Key or wrong page

```bash
npm run feature:grill -- WCRM020104 --reject --reason "Wrong function"
```

Fetch the right key. Do not edit `raw/page.md` to “fix” a wrong page.

### D. Chat-only correction

In Copilot or Kiro: “Remove EVT_007 from the grill; keep the rest.” The Analyst may edit `grill.json` / `grill.md` only. You still run `--agree` so the harness records **who** signed.

---

## What Phase 0 does **not** do

- No `ui-contract.json` (that is Phase 1).
- No `component-map.json` confirmation (Phase 1).
- No page implementation (Phase 2).
- No Jira MCP.

---

## Copilot / Kiro shortcut

Chat → Agents → **UI Requirement Analyst** (Copilot: `.github/agents/`; Kiro: `.kiro/agents/ui-requirement-analyst.json`):

```text
URL=https://tdem.atlassian.net/wiki/spaces/TC1/pages/<id>/...
```

or

```text
Function Key=WCRM020104
```

The agent must run `feature:fetch`, open `grill.md`, and **stop** until you agree. If it starts a contract or `.tsx` in Phase 0, stop it. Do not create `.kiro/specs/` for this Function Key — use `specs/<ID>/`.

---

## Phase 0 done when

- [ ] `raw/` has the published DR for this Function Key (from URL or key search)  
- [ ] You reviewed `grill.md` (single screen, menu/exists, latest, gaps)  
- [ ] Any small edits are in `grill.json` and reflected in `grill.md`  
- [ ] `grill.json` `"status": "agreed"` with your name  

Then go to **[Phase 1](./PHASE-1.md)** (contract + component map).
