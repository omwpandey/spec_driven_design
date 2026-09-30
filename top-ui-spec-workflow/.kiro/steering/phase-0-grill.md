---
inclusion: auto
name: phase-0-grill
description: Interactive Phase 0 for a Confluence DR URL or Function Key. Use when the user says Phase 0, grill, fetch DR, feature:fetch, pastes a Confluence URL, or starts a new Function Key.
---

# Phase 0 grill

When the user wants Phase 0, grill, `feature:fetch`, or pastes a Confluence DR URL, follow `.kiro/skills/grill-ui-requirement/SKILL.md`.

Accept a URL or a Function Key. Derive the key from the page when only a URL is given. Do not require `agenticDR` in the title. Ask one question at a time for agree/edit/reject, `--by` name, notes, and reject reason. Do not write `ui-contract.json` or React until `grill.json` is `agreed`.

Runbook: `../top-spec-workflow/specs/guides/PHASE-0.md`.
#[[file:../top-spec-workflow/specs/guides/PHASE-0.md]]
