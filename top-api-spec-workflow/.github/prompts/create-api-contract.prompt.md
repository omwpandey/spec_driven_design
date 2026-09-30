---
name: create-api-contract
description: Create or update an API contract from an agreed shared feature specification.
---

# Create API Contract

Use `/prepare-api-contract` first when the feature needs normalization or evidence review. Its output is
chat-only preparation; do not save it as a second specification.

1. Locate `top-spec-workflow/specs/<FUNCTION_KEY>/`.
2. Confirm `grill.json` status is `agreed`. Copy `identified.validations` into the API contract.
3. Read `grill.json`, `grill.md`, `sources.md`, and relevant `raw/` data maps. Do not read requirements.md, design.md, or acceptance.md.
4. Create or update `api-contract.json` using `schemas/api-contract.schema.json`. Add an `apis` entry for every identified API: `id`, `method`, `path`, `requestExample`, `responseExample`, and the validation errors from the grill. `responseExample` is the UI mock body.
5. Create or update `contract-map.json` using `schemas/contract-map.schema.json`. Map each UI field or action that calls data to one `apiId`. Do not put React component choices in this file.
6. Add source references for every material decision.
7. Keep unknown behavior in `openQuestions`. Do not invent a path or response example that the DR does not support.
8. Do not write Java source code.
9. Validate both files before reporting completion. The UI track copies `screen.api` from this map and must not start screen generation before both files exist.
