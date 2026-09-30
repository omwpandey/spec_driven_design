---
name: prepare-api-contract
description: Analyze agreed shared requirements and prepare source-backed API contract decisions for review.
---

# Prepare API Contract

Use this prompt after the shared feature grill is agreed and before creating or updating
`api-contract.json`. It produces review notes only. Do not create or maintain a separate Function Spec.

The durable API specification is `top-spec-workflow/specs/<FUNCTION_KEY>/api-contract.json`. Java
generation and review must consume that validated contract, not these notes.

## Preconditions

1. Locate `top-spec-workflow/specs/<FUNCTION_KEY>/`.
2. Confirm `grill.json.status` is `agreed`; otherwise stop.
3. Read `grill.json`, `grill.md`, `requirements.md`, `design.md`, `acceptance.md`, `sources.md`, and
   relevant files under `raw/`.

Attached DR documents, spreadsheets, mock-ups, and existing functions may provide supporting evidence,
but they do not replace the shared feature artifacts.

## Review output

Return the following in chat for developer review:

### Source map

List each source ID, its shared artifact or raw reference, and the decisions it supports.

### Proposed contract decisions

Cover only source-supported decisions for:

- feature identity and function ID;
- entities, tables, primary keys, and relationships;
- request fields versus search/filter fields;
- types, nullability, lengths, and documented validation;
- actions and framework registration mode;
- named queries, SQL, transaction, and concurrency behavior when explicitly documented;
- business rules and required processors;
- permissions, error-code references, response shape, and acceptance criteria.

For every decision, include one or more source IDs. Preserve field order from the source material.

### Open questions

List every unsupported or conflicting behavior. Do not invent table mappings, permissions, validation,
error codes, error messages, endpoint behavior, query strategy, or concurrency strategy. Unresolved
material behavior must remain in `openQuestions` in the API contract.

### Handoff

End with:

1. a concise list of decisions ready to transfer;
2. a concise list of blocking questions;
3. the instruction to run `/create-api-contract` to write or update the only durable contract.

Do not write Java source code or any separate Function Spec file.