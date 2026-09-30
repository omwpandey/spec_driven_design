# Top UI - Manual UI Code Review Checklist

**Use for:** Manual review of any Top UI screen, feature module, or shared UI change.  
**Review output:** Record findings in `TOP_UI_SPEC_ROOT/<FUNCTION_KEY>/review.md`.  
**Review rule:** Mark `[x]` only after inspecting the code and behavior. Record the file, symbol, and evidence for every failed item.

## Checklist

1. **File naming and placement**
   - [ ] Files follow S&G naming conventions: generated pages use `PascalCasePage.tsx`, shared components use `PascalCase.tsx`, hooks use `use{Name}.ts`, services use `{name}Service.ts`, types use `{name}.types.ts`, constants use `camelCase.ts`, and tests use `{Component}.test.tsx`.
   - [ ] Files are placed in the correct layer: feature code under `src/modules/<FUNCTION_KEY>/`, shared UI under `src/components/`, hooks under `src/hooks/`, services under `src/services/`, and shared types/utilities in their approved folders.
   - [ ] No parallel component library, `src/comp`, duplicate infrastructure, or incorrectly placed page has been introduced.

2. **Identifier naming**
   - [ ] Components and types use `PascalCase`; functions and variables use `camelCase`; constants use `UPPER_SNAKE_CASE`.
   - [ ] Event handlers use `handle{Event}` names, such as `handleSave` and `handleDelete`.
   - [ ] Boolean variables use `is`, `has`, or `should` prefixes, such as `isLoading`, `hasError`, and `shouldConfirm`.
   - [ ] Names describe business intent clearly; there are no unexplained one-letter variables, vague names, or misleading abbreviations.

3. **Component reuse and catalog compliance**
   - [ ] All UI controls use approved components from `src/components` and the component catalog.
   - [ ] No raw HTML `button`, `input`, `select`, or `textarea` is used in governed UI code.
   - [ ] No direct MUI `Button`, `TextField`, `Select`, `Table`, `IconButton`, or `Dialog` is used where a project wrapper exists.
   - [ ] New shared components are genuinely reusable, documented in the component map when required, and added to the catalog.

4. **Page structure and styling**
   - [ ] `*Page.tsx` files compose layout and feature sections; significant business logic is delegated to hooks, services, validators, or local components.
   - [ ] No style objects, `sx` blocks, CSS rules, or visual constants are defined inside `*Page.tsx`; page styling is in the approved `.styles.ts` file, shared components, or theme tokens.
   - [ ] Existing layout, spacing, typography, color, and responsive tokens are reused instead of introducing one-off visual values.
   - [ ] Screen-local components remain local; components shared across features are moved to the shared component layer rather than copied.

5. **React API and component design**
   - [ ] Components use idiomatic React: props are explicit and typed, hooks are called only at the top level, effects synchronize external systems, and side effects do not run during render.
   - [ ] Components have one clear responsibility and avoid deeply coupled prop chains, oversized JSX, or hidden mutation.
   - [ ] Lists use stable domain keys rather than array indexes as identity.
   - [ ] Async behavior handles loading, success, failure, retry, cancellation, and duplicate submission appropriately.
   - [ ] Existing project abstractions (`apiService`, `useApi`, translation hooks, permission hooks, error handling, and shared form components) are used instead of new equivalents.

6. **`useState` best practice**
   - [ ] State is kept close to the component that owns and consumes it; state is not lifted without a real sharing need.
   - [ ] State contains the minimum source-of-truth data; derived values are calculated rather than duplicated in state.
   - [ ] Related state is grouped appropriately, while independent state is not unnecessarily combined into one object.
   - [ ] Functional state updates are used when the next value depends on the previous value.
   - [ ] State updates are immutable, preserve unrelated fields, and cannot lose data during rapid user interaction.
   - [ ] Effects are not used to mirror props into state or calculate values that can be derived during render.

7. **Reducer and shared state management**
   - [ ] `useReducer` or Redux is used when state has multiple related transitions, complex workflows, or cross-component ownership; simple local state is not over-engineered.
   - [ ] Reducers are pure, deterministic, immutable, and free of API calls, navigation, logging, or other side effects.
   - [ ] Actions express business events rather than arbitrary field mutations and use discriminated, typed payloads.
   - [ ] Reducer state has explicit initial, loading, success, empty, and error states where applicable.
   - [ ] Redux state is used for genuinely shared or application-level state; transient field and dialog state stays local.
   - [ ] Selectors and dispatch usage are typed, narrow, and do not cause avoidable whole-page rerenders.

8. **Field validation and form behavior**
   - [ ] Every required field has both a clear required indicator and executable validation.
   - [ ] Validation rules match the approved contract: type, format, range, length, conditional requirements, uniqueness, and cross-field rules are checked.
   - [ ] Validation occurs at the correct interaction point, such as blur/change for immediate feedback and submit for complete validation.
   - [ ] Errors identify the affected field, explain how to correct it, and clear when the value becomes valid.
   - [ ] Server validation errors map to the correct fields and are not replaced by a generic success state.
   - [ ] Invalid forms cannot submit; valid forms cannot be blocked by stale errors or hidden fields.

9. **API and data integrity**
   - [ ] API calls use the approved service abstraction and exact contract endpoint/method; no second HTTP client is introduced.
   - [ ] Request and response data are explicitly typed and mapped at the service boundary.
   - [ ] The UI shows success only after the server confirms success and preserves recoverable input after failure.
   - [ ] Permissions are enforced for protected actions, and immutable or read-only fields cannot be changed through the UI.

10. **Accessibility and user experience**
    - [ ] Inputs have accessible labels, required state, associated validation text, and logical keyboard focus order.
    - [ ] Buttons and icon actions have accessible names; dialogs manage focus correctly; feedback is not communicated by color alone.
    - [ ] Loading, empty, error, disabled, unauthorized, and success states are visible and understandable.
    - [ ] The screen remains usable at mobile, tablet, and desktop widths; long translations and error messages do not overlap or hide controls.

11. **Testing readiness**
    - [ ] Tests cover the user-visible behavior: render, main interactions, validation boundaries, loading, API success/failure, permissions, and important state transitions.
    - [ ] Tests use accessible queries and realistic user interactions, and shared component changes include regression coverage.
    - [ ] The implementation has no debug logging, fake success path, untracked TODO behavior, or untested critical branch that would prevent a production review.

## Manual Review Result

**Feature / screen:**  
**Reviewer:**  
**Date:**  
**Verdict:** `PASS` / `PASS WITH FOLLOW-UP` / `WARNING` / `FAIL`  
**Failed checklist items:**  
**Blocking findings:**  
**Follow-up ticket or decision:**  
