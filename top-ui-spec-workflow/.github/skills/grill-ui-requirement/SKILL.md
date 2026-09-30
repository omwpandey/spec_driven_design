---
name: grill-ui-requirement
description: After fetching a published DR, present the identified screen, fields, actions, and APIs and stop until the developer agrees. Use when the user says grill me, review requirements, or after feature:fetch.
argument-hint: "[function key]"
---

# Grill UI requirement

Do not implement React. Do not write `ui-contract.json` until `grill.json` status is `agreed`. Runbook: [specs/guides/PHASE-0.md](../../../../top-spec-workflow/specs/guides/PHASE-0.md).

Feature artifacts are under `TOP_UI_SPEC_ROOT/<FUNCTION_KEY>/`, normally `../top-spec-workflow/specs/<FUNCTION_KEY>/`. Run Phase 0 commands from `top-spec-workflow`.

In **Cursor**, follow the interactive loop in [.cursor/skills/phase-0-grill/SKILL.md](../../../.cursor/skills/phase-0-grill/SKILL.md): run `feature:fetch` / `feature:grill` from a Confluence URL or Function Key (derive the key from the page title/URL when omitted). Use the structured question tool for agree/edit/reject, `--by` name, notes, and reject reason. Do not guess those values. Do not require `agenticDR` in the title.

In **Kiro**, follow [.kiro/skills/grill-ui-requirement/SKILL.md](../../../.kiro/skills/grill-ui-requirement/SKILL.md). Ask one question at a time in chat (no structured question tool). Same fetch/grill commands and stop-until-agree rule.

## Required input

`specs/<FUNCTION_KEY>/grill.md` produced by:

```bash
cd ../top-spec-workflow
npm run feature:fetch -- --url "<DR_URL>"
npm run feature:fetch -- <FUNCTION_KEY>
```

## Procedure

1. Open `grill.md` and `raw/page.md`. List UX Design tasks (`UX-001`…), then counts: modes, fields, actions, APIs, missing.
2. Ask the developer, in chat, whether this is what to build. Call out gaps (`missing`, empty objective, no Item_Desc, no **UX Design** mockup). Only screens under UX Design are in scope; if several mockups, they are separate tasks (`UX-001`…).
3. Apply their corrections only when they state them. Do not invent fields or validations to fill gaps.
4. When they agree, run:

```bash
cd ../top-spec-workflow
npm run feature:grill -- <FUNCTION_KEY> --agree --by "<their name>"
```

5. Only then use `analyze-ui-requirement` to write the contract from `raw/` plus the agreed grill.

If they reject, run `--reject --reason "<text>"` and stop.
