---
applyTo: "top-spec-workflow/specs/**/*"
---

# Requirement Traceability

Every material business rule must be traceable to a source.

The specs root is the shared `top-spec-workflow/specs` folder (`TOP_SPEC_ROOT` for fetch and grill, and `TOP_UI_SPEC_ROOT` for UI scripts), not a local `top-ui-spec-workflow/specs` folder.

Use source references like:

```json
{ "sourceId": "dr-page", "locator": "Button Settings > Save" }
```

Do not infer hidden business behavior from UX appearance. Conflicting sources go to `conflicts`; unknowns go to `openQuestions`. Open conflicts must not be silently implemented.
