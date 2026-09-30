# Top UI Project - UI Code Review Checklist

**Purpose:** Project-wide review standard for every Top UI screen, feature module, shared component, hook, service, and UI workflow change.

**Applies to:**

- `top-ui/src/modules/**`
- `top-ui/src/components/**`
- `top-ui/src/hooks/**`
- `top-ui/src/services/**`
- `top-ui/src/core/**`
- `top-ui/src/app/**`
- Feature artifacts in `TOP_UI_SPEC_ROOT/<FUNCTION_KEY>/`

**Required feature review output:** `TOP_UI_SPEC_ROOT/<FUNCTION_KEY>/review.md`

## Review Verdicts

- **PASS:** No blocking findings; required evidence is present.
- **PASS WITH FOLLOW-UP:** No release blocker; explicitly tracked non-blocking work remains.
- **WARNING:** The implementation is reviewable, but important contract, API, UX, or test gaps remain.
- **FAIL:** A blocking rule is violated or required behavior is incorrect.

A reviewer must report findings before the summary. Every finding should include severity, file, behavior, evidence, and a recommended correction.

## 1. Review Setup And Scope

### Blocking

- [ ] The Function Key or screen identifier is known.
- [ ] The changed files and their owning layer are identified.
- [ ] The relevant `ui-contract.json`, `component-map.json`, `feature.md`, `sources.md`, `grill.md`, acceptance criteria, and decisions are read.
- [ ] The review uses the shared `TOP_UI_SPEC_ROOT`; no local parallel specs directory is created or used.
- [ ] The screen has an agreed grill before UI contract or React implementation work begins.
- [ ] The requested behavior is distinguished from implementation assumptions and unresolved questions.
- [ ] Scope is limited to the requested feature and required shared infrastructure changes.
- [ ] Unrelated dirty-worktree changes are preserved and not treated as part of this review without evidence.

### Review Evidence

- [ ] Changed files are listed in the feature review.
- [ ] The reviewer records the commands run and their results.
- [ ] The reviewer records any missing source, API contract, permission rule, route, or acceptance evidence.

## 2. Specification And Traceability

### Contract Completeness

- [ ] Every implemented field maps to a contract requirement.
- [ ] Every implemented action maps to a contract event or approved decision.
- [ ] Every material validation rule has a source reference.
- [ ] Every acceptance criterion has an implementation or test reference.
- [ ] Add, Update, View, Delete, and other supported modes are explicitly covered.
- [ ] Loading, empty, error, unauthorized, disabled, and success states are specified or intentionally marked not applicable.
- [ ] API paths, methods, request fields, response fields, and error behavior come from an approved contract.
- [ ] Routes, permissions, and navigation labels are explicit and consistent with the application registry.

### Source Discipline

- [ ] No business rule is inferred only from visual appearance.
- [ ] Conflicting sources are recorded under `conflicts` and resolved explicitly.
- [ ] Unknown behavior is recorded under `openQuestions` and is not silently invented.
- [ ] Developer decisions are documented with owner, date, rationale, and affected requirement.
- [ ] UX-only content is not promoted into hidden API or business behavior without evidence.
- [ ] Out-of-scope controls are not added because they appear in a neighboring screen.
- [ ] The review does not reread or reinterpret external source material when the approved local artifacts are sufficient.

### Traceability Table

For each material requirement, the review should be able to answer:

| Requirement | Source | Implementation | Test | Status |
|---|---|---|---|---|
| `<ID>` | `<sourceId / locator>` | `<file / symbol>` | `<test>` | PASS / GAP |

## 3. Component Map And Shared UI Governance

### Blocking

- [ ] Every contract field and action has a component-map entry.
- [ ] Each mapping has a valid decision: `reuse`, `configure`, `compose`, `extend`, `new-shared`, or `page-specific`.
- [ ] Each mapping has a meaningful rationale, especially for `extend`, `new-shared`, and `page-specific`.
- [ ] `reuse` and `configure` mappings name an export from `src/components/COMPONENT_CATALOG.md`.
- [ ] Shared components are used before creating page-specific components.
- [ ] A new shared component is justified by reuse or a real missing capability.
- [ ] New shared exports are added to the catalog after implementation.
- [ ] A page-specific component is placed under the owning Function Key module or approved screen path.
- [ ] No duplicate component kit, `src/comp`, or parallel shared infrastructure is introduced.
- [ ] Pages are not added to the component catalog.

### Forbidden Raw Controls

In governed UI code under `src/modules`, `src/demoModules`, and `src/components/screens`:

- [ ] No raw HTML `<button>`, `<input>`, `<select>`, or `<textarea>` is used.
- [ ] No direct MUI `Button`, `TextField`, `Select`, `Table`, `IconButton`, or `Dialog` is used.
- [ ] Existing wrappers such as `FormTextField`, `FormSelect`, `DataTable`/`TopTable`, `ConfirmDialog`, `SaveButton`, `DeleteButton`, and layout components are used.
- [ ] Any exception is documented in `ui-governance.config.json` and is narrowly scoped.
- [ ] MUI `Box`, `Grid`, `Stack`, and `Typography` are used only as permitted layout primitives.
- [ ] Mapped shared components are actually used; a mapping must not exist only to satisfy a validator.

## 4. Architecture And File Placement

### Feature Structure

- [ ] Generated pages are under `src/modules/<FUNCTION_KEY>/`.
- [ ] Generated page names use PascalCase with the `Page.tsx` suffix.
- [ ] A feature has the expected local structure: page, styles where needed, test, index, and local components where justified.
- [ ] Feature services use `src/services/<FUNCTION_KEY>Service.ts` when `apiService` alone is insufficient.
- [ ] Shared hooks use `src/hooks/use{Feature}.ts` and are exported through the hook barrel where appropriate.
- [ ] Feature types are colocated or placed in the approved shared types location.
- [ ] No CSS modules or ad hoc styling system is introduced.
- [ ] Existing pages are not renamed solely to fit a new convention.

### Thin Page Rule

- [ ] Pages compose sections and coordinate events; significant business logic is outside JSX.
- [ ] Business rules are isolated in an appropriate hook, service, validator, reducer, or domain utility.
- [ ] Existing CRUD, manifest, routing, error, permission, and form infrastructure is reused where applicable.
- [ ] The implementation does not duplicate API clients, state libraries, validation libraries, or translation systems.
- [ ] Shared component changes preserve backward compatibility and include regression tests.
- [ ] Generated registries, routes, and MSW handlers are updated through the established workflow rather than manually diverging from source artifacts.

## 5. React And TypeScript Quality

- [ ] TypeScript strictness is preserved; no unnecessary `any`, unsafe casts, or ignored diagnostics are added.
- [ ] Public component props, refs, row models, API payloads, and responses have explicit types.
- [ ] Components, functions, variables, constants, booleans, and event handlers follow project naming conventions.
- [ ] React state is kept near its consumer and has a single clear owner.
- [ ] State updates are immutable and preserve data during rapid add/edit/delete interactions.
- [ ] Effects have correct dependencies and are used only when synchronization is required.
- [ ] No side effects occur during render.
- [ ] Stable keys are used for rendered collections; array indexes are not used as persistent identity.
- [ ] Refs and imperative handles expose the smallest necessary API.
- [ ] Async operations handle loading, success, failure, cancellation, and duplicate submission behavior.
- [ ] No stale closure or stale state can corrupt the submitted payload.
- [ ] Comments explain non-obvious decisions and do not restate obvious code.
- [ ] Temporary fallback data, debug logging, TODO-only behavior, and fake success paths are removed or clearly isolated from production behavior.

## 6. UI Behavior And State Coverage

For every screen, review the complete state matrix, not only the happy path.

- [ ] Initial load state is intentional and does not flash incomplete content.
- [ ] Populated state renders all required fields, actions, and current values.
- [ ] Empty state explains what the user can do next.
- [ ] Loading state prevents conflicting actions without trapping the user.
- [ ] Validation state identifies the field and explains how to correct it.
- [ ] Server/API error state is actionable and does not falsely report success.
- [ ] Network/offline/slow responses behave consistently with shared error handling.
- [ ] Permission-denied state is handled without exposing unauthorized actions.
- [ ] Disabled and read-only controls match mode and permission rules.
- [ ] Dirty state, navigation away, reset, cancel, and confirmation behavior preserve or discard data deliberately.
- [ ] Save, Update, Delete, Add, Search, Filter, Sort, Pagination, Upload, and Download actions behave as specified.
- [ ] Dialogs and toasts use approved copy and appear only after the correct operation state.
- [ ] Optimistic UI is not used where rollback or data integrity is unclear.
- [ ] Duplicate requests and double clicks cannot create duplicate records or conflicting state.

## 7. Forms, Tables, And Validation

### Forms

- [ ] Forms use the project React Hook Form and Yup patterns where applicable.
- [ ] Required indicators are consistent with actual validation.
- [ ] Client validation matches the contract and does not invent business rules.
- [ ] Server validation errors map back to the correct controls.
- [ ] Error containers preserve layout and do not cause avoidable layout shift.
- [ ] Input types, ranges, formats, max lengths, and defaults match the contract.
- [ ] Submit validation covers the complete form, not only the last edited field.
- [ ] Unsaved changes are detected for all relevant editable state, including table rows and dialogs.

### Tables

- [ ] Tables use the approved `DataTable`/`TopTable` or a documented page-specific exception.
- [ ] Sort, filter, pagination, selection, and export behavior is correct when supported.
- [ ] Empty, loading, and error table states are implemented.
- [ ] Editable rows have stable ids and deterministic status transitions.
- [ ] Inline validation occurs at the documented interaction point.
- [ ] Save validates every row and blocks invalid submissions.
- [ ] Add, Update, and Delete row states are retained correctly for the API payload.
- [ ] Deleting persisted rows retains the required `DEL` information until Save.
- [ ] Row numbering, keyboard movement, and action placement remain correct after mutations.
- [ ] Duplicate records and cross-row rules are validated where specified.

## 8. API, State, Security, And Data Integrity

- [ ] API calls go through `apiService`, `useApi`, or the approved service abstraction.
- [ ] Endpoint constants come from `src/services/endpoints.ts` or the feature service convention.
- [ ] The implementation uses the exact contract method/path and does not invent endpoint semantics.
- [ ] Request and response mapping is typed and tested.
- [ ] Authentication, token refresh, and authorization remain in shared infrastructure.
- [ ] Permission checks exist in both UI behavior and server expectations.
- [ ] API failures do not expose tokens, secrets, stack traces, or sensitive backend details.
- [ ] User-controlled values are rendered safely; no unsafe HTML injection is introduced.
- [ ] Client validation is not treated as a substitute for server validation.
- [ ] Immutable fields cannot be changed through the UI or crafted payload.
- [ ] Records from one route parameter or screen instance cannot leak into another.
- [ ] Delete, retry, and save operations are idempotent or safely guarded against repetition.
- [ ] Mock handlers reflect the contract and cover both successful and failed responses.
- [ ] No production screen reports success before the server confirms success.

## 9. Internationalization And Design System

- [ ] Static labels, headings, buttons, table headers, dialogs, validation messages, and toasts use `t('key')`.
- [ ] New keys exist in all supported language files, currently `en.ts` and `th.ts`.
- [ ] API values are displayed as received and are not passed through translation.
- [ ] Fallback values follow the existing application defaults convention.
- [ ] Prompt and Thai typography remains controlled by the theme.
- [ ] Colors, spacing, typography, borders, elevation, and breakpoints use theme tokens or approved shared styles.
- [ ] Shared component defaults are preserved unless the contract requires a documented override.
- [ ] Required fields, statuses, alerts, and destructive actions are visually consistent across screens.
- [ ] No one-off branding, palette, or interaction pattern is introduced without design approval.

## 10. Accessibility And Responsive UX

- [ ] Every input has an accessible label and a programmatic relationship to its error text.
- [ ] Required state is exposed programmatically, not only through a visual asterisk.
- [ ] Buttons and icon actions have accessible names; unfamiliar icons have tooltips where appropriate.
- [ ] Keyboard focus order is logical and visible.
- [ ] Radio groups, selects, tables, menus, and dialogs support keyboard operation.
- [ ] Dialog focus is trapped appropriately and returns to the invoking control on close.
- [ ] Validation, loading, success, and error feedback is perceivable without color alone.
- [ ] Text and controls meet contrast and readable-size expectations.
- [ ] Screen reader users can identify page title, landmarks, headings, table headers, row actions, and errors.
- [ ] Layout works at mobile, tablet, and desktop sizes without hidden actions or horizontal overflow that prevents use.
- [ ] Long translations, large values, and empty/error copy fit their containers.
- [ ] Touch targets and table actions remain usable on smaller screens.

## 11. Testing And Verification

### Required Automated Coverage

- [ ] New or changed shared components have focused tests.
- [ ] Every acceptance criterion has at least one test or an explicit documented reason it is manual.
- [ ] Tests use Testing Library roles, labels, and user interactions rather than implementation details.
- [ ] Add, Update, View, Delete, validation, confirmation, cancellation, and permission paths are covered where applicable.
- [ ] Tests cover loading, empty, API success, API failure, and retry states.
- [ ] Tests cover boundary values and invalid inputs for every non-trivial validation rule.
- [ ] Tests verify API payloads, including retained deleted rows and immutable fields.
- [ ] MSW is used for API behavior rather than ad hoc network mocks where appropriate.
- [ ] Tests are deterministic and clean up mocks, timers, and mounted components.
- [ ] Coverage remains at or above the configured project thresholds: statements 85%, branches 70%, functions 85%, lines 85%.

### Manual Verification

- [ ] Desktop layout reviewed.
- [ ] Mobile/responsive layout reviewed.
- [ ] Keyboard-only navigation reviewed.
- [ ] Accessibility semantics reviewed with an appropriate browser or screen-reader check.
- [ ] Browser compatibility reviewed for the supported browser matrix.
- [ ] Network error, slow response, empty data, invalid input, and permission-denied paths reviewed.
- [ ] Visual result compared with the approved UX source where one exists.

## 12. Required Commands

Run from `top-ui-spec-workflow` with environment variables pointing to the application and shared specs repositories:

```powershell
$env:TOP_UI_APP_ROOT = "C:\path\to\top-ui"
$env:TOP_UI_SPEC_ROOT = "C:\path\to\top-spec-workflow\specs"
```

### Feature Review

```powershell
npm run feature:validate -- <FUNCTION_KEY>
npm run component-map:validate -- <FUNCTION_KEY>
npm run ui:harness -- <FUNCTION_KEY>
```

### Application Review

Run from `top-ui`:

```powershell
npm run lint
npm run build
npm run test
npm run test:coverage
```

### Catalog Review

Run after adding or changing shared exports:

```powershell
npm run ui:catalog
```

The catalog must be reviewed after generation. Do not accept catalog churn that is unrelated to the change.

### Command Results

| Command | Result | Notes |
|---|---|---|
| `feature:validate` | PASS / FAIL | |
| `component-map:validate` | PASS / FAIL | |
| `ui:harness` | PASS / FAIL | |
| `ui:catalog` | PASS / N/A | |
| `npm run lint` | PASS / FAIL | |
| `npm run build` | PASS / FAIL | |
| `npm run test` | PASS / FAIL | |
| `npm run test:coverage` | PASS / FAIL | |

A validator failure may be a pre-existing contract or repository issue, but it must be reported and must not be relabeled as a pass for the reviewed change.

## 13. Review Report Template

Use this structure in `TOP_UI_SPEC_ROOT/<FUNCTION_KEY>/review.md`:

```markdown
# UI Review - <FUNCTION_KEY>

**Verdict:** PASS / PASS WITH FOLLOW-UP / WARNING / FAIL

## Scope

- Contract:
- Component map:
- Changed implementation files:
- Reviewer:
- Date:

## Findings

### BLOCKER

- **B1 - <short title>**
  - File/symbol:
  - Requirement or standard:
  - Evidence:
  - Required correction:

### WARNING

- **W1 - <short title>**
  - File/symbol:
  - Requirement or standard:
  - Evidence:
  - Follow-up:

### PASS Notes

- <important verified behavior or standard>

## Traceability

| Requirement | Implementation | Test | Status |
|---|---|---|---|
| `<ID>` | `<file/symbol>` | `<test>` | PASS / GAP |

## Validators

- `feature:validate`: PASS / FAIL / NOT RUN
- `component-map:validate`: PASS / FAIL / NOT RUN
- `ui:harness`: PASS / FAIL / NOT RUN
- `lint`: PASS / FAIL / NOT RUN
- `build`: PASS / FAIL / NOT RUN
- `test`: PASS / FAIL / NOT RUN
- `coverage`: PASS / FAIL / NOT RUN

## Open Questions And Follow-Ups

- <ticket, decision, or explicit reason>

## Sign-Off

- Reviewer:
- Engineering owner:
- QA owner:
- Release decision:
```

## 14. Release Gate

Do not approve a feature when any of the following is true:

- [ ] A required behavior is implemented without a source or approved decision.
- [ ] An open conflict is silently resolved in code.
- [ ] A contract action or acceptance criterion has no implementation/test evidence.
- [ ] Raw controls or forbidden MUI controls bypass the shared catalog without an approved exception.
- [ ] API behavior is faked, logged, or reported as successful without server confirmation.
- [ ] Authorization or permission behavior is missing for a protected action.
- [ ] A shared component regression is introduced without regression coverage.
- [ ] Critical loading, empty, validation, error, or unauthorized states are missing.
- [ ] Accessibility prevents keyboard or assistive technology use.
- [ ] The build, lint, focused tests, or required workflow validators fail because of the reviewed change.
- [ ] Known warnings are not documented with an owner and follow-up decision.

**Final verdict:** `PASS` only when all blocking checks pass and the evidence is recorded.
