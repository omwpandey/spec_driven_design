# Migration Task: Extract UI Spec Workflow

## Objective

Move UI specification artifacts and spec-driven automation out of `top-ui` so requirement material can remain private and be reused later by the Java API workflow.

## Scope

- Keep `specs/` feature artifacts, raw DR exports, screenshots, spreadsheets, and contracts in the shared `top-spec-workflow` repository.
- Move UI-specific agents, skills, prompts, hooks, and validation scripts here.
- Keep React implementation, shared components, runtime configuration, and application tests in `top-ui`.
- Use `TOP_UI_APP_ROOT` to validate the external React application.
- Keep API contract generation out of this migration until Java requirements are provided.

## Acceptance criteria

- No DR exports or UI contracts are required in the `top-ui` Git repository.
- UI workflow commands can locate the external `top-ui` application through `TOP_UI_APP_ROOT`.
- Feature validation reads contracts from `TOP_UI_SPEC_ROOT`, normally the shared `top-spec-workflow/specs` directory.
- Component-map validation reads the component catalog and source files from `TOP_UI_APP_ROOT`.
- `ui:guard` scans governed React files in `TOP_UI_APP_ROOT`.
- Existing React source behavior is unchanged.

## Follow-up

After the UI extraction is stable, define the Java workflow input and the shared API contract shape with the developer before adding API-specific automation.
