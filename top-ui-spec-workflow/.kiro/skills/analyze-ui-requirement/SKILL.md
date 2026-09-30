---
name: analyze-ui-requirement
description: Normalize a fetched published DR (raw/ + agreed grill) into a source-traceable UI contract. Use after feature:fetch and developer agree. Do not implement React.
---

# Analyze UI Requirement

Requirement normalization only; no React implementation. Require `specs/<ID>/grill.json` status `agreed`.

Canonical twin: `.github/skills/analyze-ui-requirement/SKILL.md`. Read its extraction rules and templates before writing:

```text
.github/skills/analyze-ui-requirement/references/extraction-rules.md
.github/skills/analyze-ui-requirement/templates/feature.md
.github/skills/analyze-ui-requirement/templates/ui-contract.json
```

Primary inputs are local files produced by `npm run feature:fetch` from `top-spec-workflow`:

```text
specs/<FUNCTION_KEY>/raw/page.md
specs/<FUNCTION_KEY>/raw/sheets/
specs/<FUNCTION_KEY>/raw/images/
specs/<FUNCTION_KEY>/grill.md
```

Do not call Confluence or Jira.

## Procedure

1. Identify sources with stable IDs such as `dr-page`, `ux-image`, `item-desc`, `api-map`, `data-map`, `approved-code`, or `developer-decision-001`.
2. Extract screen structure: screen, modes, visible sections, fields, controls, actions, dialogs, results, visible states.
3. Extract fields: label, semantic UI type, section, mode behavior, validations, source refs. Do not choose React components.
4. Extract actions/events: trigger, preconditions, frontend validations, validation-failure behavior, specified action, success/failure effects, source refs.
5. Extract source-backed permissions and relevant states.
6. Normalize acceptance criteria to stable IDs.
7. Capture source disagreements in `conflicts` and unknowns in `openQuestions`.
8. Set `blocking: true` when proceeding would require inventing a material business rule.
9. Write only `specs/<STORY-ID>/sources.md`, `feature.md`, and `ui-contract.json`.

```bash
npm run feature:validate -- <FUNCTION_KEY>
```

Return only a compact summary: story ID, source/field/action/conflict counts, blocking-question count, and contract path. Do not return raw source material.
