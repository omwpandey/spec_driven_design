---
name: create-api-contract
description: Create or update an API contract from an agreed shared feature specification.
---

# Create API Contract

Use `/prepare-api-contract` first when the feature needs normalization or evidence review. Its output is
chat-only preparation; do not save it as a second specification.

1. Locate `top-spec-workflow/specs/<FUNCTION_KEY>/`.
2. Confirm `grill.json.status` is `agreed`.
3. Read `requirements.md`, `design.md`, `acceptance.md`, `sources.md`, and relevant `raw/` data maps.
4. Create or update `api-contract.json` using `schemas/api-contract.schema.json`.
5. Add source references for every material decision.
6. Keep unknown behavior in `openQuestions`.
7. Do not write Java source code.
8. Validate the contract before reporting completion.
