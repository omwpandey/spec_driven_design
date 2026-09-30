---
name: grill-ui-requirement
description: After fetching a published DR, present the identified screen, fields, actions, and APIs and stop until the developer agrees. Use when the user says grill me, review requirements, or after feature:fetch.
argument-hint: "[function key]"
---

# Grill UI requirement

Do not implement React. Do not write `ui-contract.json` until `grill.json` status is `agreed`. Validation rules live once on that grill. Policy: [POLICY.md](../../../../top-spec-workflow/POLICY.md).

Feature artifacts are under `TOP_UI_SPEC_ROOT/<FUNCTION_KEY>/`, normally `../top-spec-workflow/specs/<FUNCTION_KEY>/`. Run fetch and grill from `top-spec-workflow`. Derive the Function Key from the page title or URL when the user gives only a URL. Do not guess the agree name, notes, or reject reason. Do not require `agenticDR` in the title.

## Required input

`specs/<FUNCTION_KEY>/grill.md` produced by:

```bash
cd ../top-spec-workflow
npm run feature:fetch -- --url "<DR_URL>"
npm run feature:fetch -- <FUNCTION_KEY>
```

## Procedure

1. Open `grill.md` and `raw/page.md`. List UX Design tasks (`UX-001`…), then counts: fields, actions, APIs, validations, missing.
2. Ask the developer, in chat, whether this is what to build. Call out gaps (`missing`, empty objective, no Item_Desc, no **UX Design** mockup). Only screens under UX Design are in scope; if several mockups, they are separate tasks (`UX-001`…).
3. Apply their corrections only when they state them. Do not invent fields or validations to fill gaps.
4. When they agree, run:

```bash
cd ../top-spec-workflow
npm run feature:grill -- <FUNCTION_KEY> --agree --by "<their name>"
```

5. Only then use `analyze-ui-requirement` to write the contract from `raw/` plus the agreed grill.

If they reject, run `--reject --reason "<text>"` and stop.
