# UI Review — WCRM010203

**Verdict:** WARNING

Reviewed against `ui-contract.json`, `component-map.json`, and `src/components/screens/WCRM010203/*`. Grill is `agreed`. `ui:guard`, `feature:validate`, and `component-map:validate` PASS.

## Coverage

Init Mode (UX-001) chrome is present: Back, activity-type radios (DCM Vehicle selected), three summary cards, Activity Setup (read-only Activity ID), DCM Vehicle Item grid, Contact Channel Details + Add, footer Delete / Set Template / Save.

Contract actions that are not blocked are wired: load (API_001/API_002 + CMB-001–004), type change with WRN0001, description/customer-type/item/channel edits, add/delete channel (WRN0002), delete activity (WRN0003 + API_004), save confirm + API_003, leave/back (WRN0001). Add Mode is not implemented (AC-010).

## Catalog

Mapped exports are used from the screen or its local tables: `PageContainer`, `PageHeader`, `BackButton`, `FormRadioGroup`, `SummaryCard`, `FormTextField`, `FormSelect`, `FormNumberField`, `FormCheckbox`, `DataTable`, `SectionCard`, `StatusIndicator`, `AddButton`, `ActionIconButton`, `DeleteButton`, `SecondaryButton`, `SaveButton`, `PageFooter`, `ScreenActionBar`, `LoadingOverlay`, `ConfirmDialog`, `ToastNotification`, `SetTemplateDialog`.

No raw MUI `Button` / `TextField` / `Select` / `Table` / `IconButton` / `Dialog` in screen code. Layout-only `Box` / `Grid` / `Stack`.

## Findings

### WARNING

- **W1 — Blocking open questions remain.** OQ-API-MAP, OQ-ACTIVITY-DAY-RANGE, OQ-ACTIVITY-NAME-ADD, OQ-ASSIGN-GROUP, OQ-SET-TEMPLATE, OQ-PERMISSIONS, OQ-ACTIVITY-TYPE-LOCK are unresolved. The screen does not invent the contested rules: no Activity Day min/max, no role matrix, no type-radio lock, no template-to-grid populate. Confirm before treating this as production-complete.
- **W2 — API paths are Function Key + contract names.** Calls go to `/WCRM010203/API_001`–`004` and `/WCRM010203/CMB-001`–`004`. Payloads are the form values. Paths and shapes stay unknown until OQ-API-MAP is answered.
- **W3 — `MessagePreviewDialog` is not imported by the screen.** It is composed inside `SetTemplateDialog` (map decision). Not a raw-MUI substitution.
- **W4 — Activity Name stays editable.** Follows contract `modeBehavior.init.editable` and required/maxLength rules. Edit vs read-only is still OQ-ACTIVITY-NAME-ADD.
- **W5 — Assign Group required only for Call Out.** Follows the contract `requiredWhen` rule. Item_Desc “mandatory on every row” is still OQ-ASSIGN-GROUP.
- **W6 — Set Template opens the catalog dialog after WRN0001.** Dialog save does not populate the channel grid (OQ-SET-TEMPLATE). ERR0024 is not applied on Save.
- **W7 — Route is a developer choice for a non-blocking OQ.** `/activity-setup/dealer-activity-maintenance` matches the mockup breadcrumb parent, not a specified path (OQ-ROUTE).

### PASS notes

- S&G §5: `DealerActivityMaintenanceDcmVehicleScreen.tsx`, `handle{Event}`, `is`/`has` booleans, `SCREEN_ID` / `UPPER_SNAKE_CASE` constants.
- Existing `ActivitySetupPage` was not reused or copied as the implementation.
- Appointment Confirmation forces Activity Day `-1` (AC-007). Suppress Days default 90 and range 0–90 (AC-004). Duplicate process+channel blocks save (AC-006).
- Footer Delete is disabled when Activity ID is empty (EVT-012 precondition: existing configuration).

## Validators

- `npm run ui:harness -- WCRM010203` PASS
- `tsc -b` PASS
- Screen unit test PASS
