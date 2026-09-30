# Code Review Checklist - WCRM010301

**Feature:** TMT Activity Maintenance - PM  
**Review scope:** `top-ui/src/modules/WCRM010301/` and its feature contract  
**Primary references:** `feature.md`, `ui-contract.json`, `component-map.json`, `grill.md`, `sources.md`  
**Review status:** `WARNING - completion blocked until the open items below are resolved`

## How To Use

- Mark each item `[x]` only after reviewing code and evidence.
- Mark `[N/A]` with a short reason when a check does not apply.
- Any unchecked item in a **Blocking** section prevents approval.
- Record follow-up issues with a ticket or decision reference; do not silently waive a requirement.

## 1. Contract And Scope

### Blocking

- [ ] The implementation matches all approved fields `CMP-WCRM010301-001..022`.
- [ ] The implementation matches all approved events `EVT_WCRM010301_01..10`.
- [ ] Add and Update modes are both reviewed, including the Update-mode Activity Type lock.
- [ ] The screen contains only the agreed scope: Activity Type, Service & Repair Inspection Item, Contact Channel Details, and Save.
- [ ] The four resolved developer decisions are implemented: Contact Process, Channel values, Activity Day range, and excluded Set Template controls.
- [ ] Every intentional deviation from the contract is recorded in `decisions.md` or an open-question reference.
- [ ] Route, permissions, API request shape, API response shape, and load behavior are confirmed before production approval.

### Evidence

- [ ] Each contract requirement has a code location or test case.
- [ ] The review confirms that no UX-only field, button, dialog, or API behavior was invented.
- [ ] The screen is reviewed against the approved UX image at desktop and mobile widths.

## 2. Functional Behavior

### Activity Type

- [ ] Periodic Maintenance is selected by default in Add mode.
- [ ] All nine Activity Type options render with correct English and translated labels.
- [ ] Only one radio option can be selected at a time.
- [ ] Activity Type is disabled for every option in Update mode.
- [ ] Changing Activity Type with unsaved grid data shows the confirmation dialog.
- [ ] Canceling the confirmation restores the previous Activity Type and does not discard data.
- [ ] Confirming the change keeps the new Activity Type and applies the documented data-loading behavior.

### Service And Repair Inspection Grid

- [ ] Add creates an editable row with `status = ADD` and a stable unique id.
- [ ] New rows require Repair/Inspection Code before Save.
- [ ] Repair/Inspection Code options come from the approved PM Operation Master source and are displayed in the required order.
- [ ] Selecting a Repair/Inspection Code populates Description from the same option and keeps Description read-only.
- [ ] Existing rows keep Repair/Inspection Code and Description disabled in Update mode.
- [ ] Mandatory defaults and changes match the contract.
- [ ] Toggling Mandatory on an existing row changes its status to `UPD`.
- [ ] Deleting an existing row removes it from the visible grid and retains it as `DEL` for persistence.
- [ ] Deleting a new unsaved row does not create an unnecessary backend delete record.
- [ ] Row numbering remains sequential after add and delete operations.
- [ ] At least one valid inspection row is required before Save.

### Contact Channel Details Grid

- [ ] Add creates an editable row with `status = ADD` and a stable unique id.
- [ ] Contact Process options contain only the approved values.
- [ ] Channel options contain Call, Email, and SMS with correct labels and values.
- [ ] Contact Process and Channel are mandatory for every visible row.
- [ ] Activity Day is mandatory, numeric, limited to two digits, and restricted to `-30..30`.
- [ ] Negative values, zero, and both range boundaries are accepted where valid.
- [ ] Blank, non-numeric, overlong, and out-of-range Activity Day values show useful validation feedback.
- [ ] Duplicate Contact Process + Channel combinations block Save and identify the affected rows.
- [ ] Editing an existing contact row changes its status to `UPD`.
- [ ] Deleting an existing contact row retains it as `DEL` for persistence.
- [ ] At least one valid contact row is required before Save.
- [ ] Row numbering remains sequential after add and delete operations.

### Save, Errors, And Persistence

- [ ] Save validates both grids before opening the confirmation dialog.
- [ ] Save does not open confirmation when required data is missing or invalid.
- [ ] Add and Update use the exact confirmation copy from the contract.
- [ ] Canceling Save confirmation leaves all entered data and row statuses unchanged.
- [ ] The payload contains Activity Type, visible rows, and deleted rows with correct `ADD`/`UPD`/`DEL` statuses.
- [ ] Save calls the approved API only after the API contract is published and mapped.
- [ ] Success feedback is shown only after a successful API response, not after logging or optimistic completion.
- [ ] API failures show the documented error state/message and preserve recoverable user input.
- [ ] Loading state prevents duplicate Save and other conflicting actions.
- [ ] Load failures render retry behavior without leaving a partially initialized form.
- [ ] Permission checks control Add, Delete, and Save actions.

## 3. React And TypeScript Quality

- [ ] Components have explicit prop, row, and API types; no `any` is introduced.
- [ ] Refs and imperative handles expose only the smallest required public surface.
- [ ] State transitions are immutable and cannot lose rows during rapid add/edit/delete actions.
- [ ] Effects have complete dependencies or a documented, verified reason for an exception.
- [ ] No stale state is used when deriving an updated row or payload.
- [ ] Stable keys are used for all mapped options, rows, and action elements.
- [ ] Event handlers do not perform side effects during render.
- [ ] API calls, translations, and permission checks use the existing application services/hooks.
- [ ] Shared catalog components are used instead of raw controls where a catalog component exists.
- [ ] No debug `console.log`, temporary fallback data, or mock success path remains in production behavior.
- [ ] Dead imports, duplicated constants, and misleading comments are removed.
- [ ] Strict TypeScript, ESLint, and project build checks pass without new warnings.

## 4. Accessibility And UX

- [ ] Every input has an accessible label associated with its control.
- [ ] Required fields expose required state programmatically, not only with a red asterisk.
- [ ] Validation errors are associated with the relevant field and announced to assistive technology.
- [ ] Delete icon buttons have accessible names and an appropriate tooltip or confirmation pattern.
- [ ] Add and Save controls have accessible names and visible keyboard focus.
- [ ] Radio group has a meaningful group label and logical keyboard navigation.
- [ ] Disabled Update-mode controls are visibly disabled and not accidentally focusable as editable fields.
- [ ] Dialog focus is trapped, initial focus is sensible, Escape behavior is correct, and focus returns to the invoking control.
- [ ] Error, loading, and success states are perceivable without relying on color alone.
- [ ] Status values `ADD`, `UPD`, and `DEL` have sufficient contrast and a non-color cue.
- [ ] Tables remain usable with keyboard navigation and screen readers.
- [ ] Layout does not overflow or hide grid actions at supported viewport widths.
- [ ] English and supported translations fit their controls without truncation or overlap.

## 5. Security And Data Integrity

- [ ] User-controlled values are rendered through React/component escaping; no unsafe HTML injection is used.
- [ ] Client validation is treated as usability support, not as the only server-side validation.
- [ ] API errors do not expose tokens, request secrets, stack traces, or sensitive backend details.
- [ ] Unauthorized Add, Delete, Update, and Save operations are rejected by the server and handled in the UI.
- [ ] The API payload cannot be manipulated to change immutable fields such as existing Repair/Inspection Code where the contract forbids it.
- [ ] Deleted rows cannot be silently omitted from Update payloads.
- [ ] Duplicate submissions are prevented or made idempotent by the service/API contract.
- [ ] Data loaded for one activity cannot leak into another activity after navigation or parameter changes.

## 6. Test Coverage

### Required Automated Tests

- [ ] Initial Add-mode render and default Activity Type.
- [ ] All nine Activity Type labels render.
- [ ] Update mode disables all Activity Type radios.
- [ ] Activity Type unsaved-change confirmation: confirm and cancel paths.
- [ ] Inspection add, edit, delete, numbering, and status transitions.
- [ ] Inspection required-code validation and zero-row validation.
- [ ] Contact add, edit, delete, numbering, and status transitions.
- [ ] Activity Day validation for blank, `-30`, `30`, `0`, `-31`, `31`, non-numeric, and more-than-two-digit values.
- [ ] Duplicate Contact Process + Channel validation.
- [ ] Save validation blocks invalid data and confirms valid data.
- [ ] Save confirmation cancel path does not mutate state.
- [ ] Successful API response shows success feedback.
- [ ] API failure shows error feedback and does not show success feedback.
- [ ] Loading and retry behavior.
- [ ] Permission-based visibility/disabled behavior.

### Test Quality

- [ ] Tests assert user-visible behavior and accessible roles/names rather than implementation details.
- [ ] Tests cover both existing and newly added rows.
- [ ] Tests verify the exact payload sent to the service, including `DEL` rows.
- [ ] Tests use MSW or the repository's established API mock pattern for success and failure responses.
- [ ] Tests are deterministic and clean up timers, mocks, and mounted components.
- [ ] The focused feature test command passes, followed by the full project test suite.

## 7. Performance And Maintainability

- [ ] Large option lists and grid updates do not cause avoidable whole-page rerenders.
- [ ] No network request is repeated on every render or keystroke without a documented reason.
- [ ] Loading, empty, error, and populated states are all intentional and visually distinct.
- [ ] Row ids remain stable and do not depend on array indexes.
- [ ] Validation logic is centralized enough to prevent Add and Update behavior from drifting.
- [ ] API mapping is isolated from presentation state and can be changed when the backend contract is finalized.
- [ ] Feature-specific constants and types live near the owning feature; shared behavior uses shared modules.
- [ ] The implementation is understandable without relying on comments that restate the code.

## 8. Required Validation Evidence

Record the command and result below before approval:

- [ ] `npm run feature:validate -- WCRM010301`
- [ ] `npm run component-map:validate -- WCRM010301`
- [ ] `npm run ui:guard -- WCRM010301`
- [ ] `npm run ui:harness -- WCRM010301`
- [ ] `npm run test -- --run src/modules/WCRM010301/TmtActivityMaintenancePage.test.tsx`
- [ ] `npm run build` or the repository-approved TypeScript/build command
- [ ] Manual keyboard and responsive review completed
- [ ] API integration reviewed against the published API data map

## Current Review Notes

The following items are known and must be resolved or explicitly accepted before a production-ready verdict:

1. The screen currently uses fallback inspection/contact data rather than loading the activity configuration from the backend.
2. The Save handler currently logs the payload and shows a success toast; it does not persist through the service.
3. The API data-map attachment is missing, so request/response shapes and endpoint behavior are not yet verifiable.
4. Permission codes and the final route are not documented in the feature contract.
5. The current automated test covers initial rendering and Activity Type mode behavior, but not grid interactions, validation, payloads, API failures, accessibility, or permissions.

## Final Sign-Off

**Reviewer:**  
**Date:**  
**Verdict:** `PASS` / `PASS WITH FOLLOW-UP` / `WARNING` / `BLOCKED`  
**Blocking issues:**  
**Follow-up tickets / decisions:**  
**Evidence links:**  
