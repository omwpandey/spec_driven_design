---
applyTo: "**/specs/**/*.json,**/*.md"
description: Rules for API contract design in the TOP API specification workflow.
---

# API contract rules

- Treat `top-spec-workflow/specs/<FUNCTION_KEY>/` as the requirement source.
- Require `grill.json.status` to be `agreed` before writing `api-contract.json`.
- Keep source references on all material contract decisions.
- Keep undocumented behavior in `openQuestions`; do not resolve it by assumption.
- Describe framework registration and business processors, not controllers or CRUD services.
- Use error-code identifiers for validation and business failures; do not put prose messages in the contract.
- Keep request/data fields separate from search/filter fields.
- Mark database mappings as unresolved unless the DR or approved data map confirms them.
- Do not copy UI-only component decisions into the API contract.
- Do not copy API contract decisions into `ui-contract.json`.
