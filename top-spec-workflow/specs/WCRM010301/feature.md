# WCRM010301 — TMT Activity Maintenance - PM

## Summary

Setup Activity screen for TMT Periodic Maintenance: configure Service & Repair Inspection items and Contact Channel Details for the Periodic Maintenance activity type.

## Sources
See `sources.md`.

## Screen
- Name: TMT Activity Maintenance - Setup Activity (Periodic Maintenance)
- Route: unknown unless supplied
- Modes: Add, Update

## UI Structure

- **Activity Type** — radio group (Periodic Maintenance + 8 other shared, out-of-scope options)
- **Service & Repair Inspection Item** — editable grid (No., Repair/Inspection Code, Description, Mandatory, Action)
- **Contact Channel Details** — editable grid (No., Contact Process, Channel, Activity Day, Action)
- **Footer** — Save

## Fields

### Periodic Maintenance
- Requirement ID: CMP-WCRM010301-001
- Label: Periodic Maintenance
- Semantic type: radio
- Mode behavior: Add — selected by default, only one Activity Type selectable at a time. Update — radio group disabled, Activity Type locked.
- Validation: Mandatory
- Sources: item-desc CMP-WCRM010301-001, dr-page On-Load Operation, ux-image

### Additional Rejected Job / DCM Vehicle / TCFR+ / SSC/SCS / Body & Paint / BP Insurance Renewal / Upload / Post Service Follow Up (PSFU)
- Requirement ID: CMP-WCRM010301-002..009
- Label: (as listed)
- Semantic type: radio
- Mode behavior: visible, deselected by default; out of scope for this Function Key (OQ-04)
- Validation: none specified
- Sources: item-desc CMP-WCRM010301-002..009, ux-image

### Status
- Requirement ID: CMP-WCRM010301-010
- Label: Status
- Semantic type: system-generated text
- Mode behavior: Add — ADD; Update — UPD or DEL depending on row action
- Validation: not editable
- Sources: item-desc CMP-WCRM010301-010, dr-page Add/Update/Delete Operation

### NO.
- Requirement ID: CMP-WCRM010301-011
- Semantic type: auto-number
- Mode behavior: sequential, not editable
- Sources: item-desc CMP-WCRM010301-011

### Repair/Inspection Code
- Requirement ID: CMP-WCRM010301-012
- Semantic type: dropdown
- Mode behavior: Add — editable, populated from PM Operation Master. Update — disabled for existing rows.
- Validation: Mandatory
- Sources: item-desc CMP-WCRM010301-012, dr-page On-Load Operation / Add Operation

### Description
- Requirement ID: CMP-WCRM010301-013
- Semantic type: text (read-only)
- Mode behavior: auto-populated from selected Repair/Inspection Code; never editable
- Validation: system-populated, not editable
- Sources: item-desc CMP-WCRM010301-013, dr-page Add Operation / Update Record

### Mandatory
- Requirement ID: CMP-WCRM010301-014
- Semantic type: checkbox
- Mode behavior: editable; checking on an existing row changes Status to UPD
- Sources: item-desc CMP-WCRM010301-014, dr-page Update Record

### Action (Delete icon) — Inspection grid
- Requirement ID: CMP-WCRM010301-015
- Semantic type: icon-button
- Mode behavior: marks row Status = DEL
- Sources: item-desc CMP-WCRM010301-015, dr-page Delete Operation

### Add Row — Inspection grid
- Requirement ID: CMP-WCRM010301-016
- Semantic type: button
- Mode behavior: adds new row, Status = ADD
- Sources: item-desc CMP-WCRM010301-016, dr-page Add Operation

### Contact Process
- Requirement ID: CMP-WCRM010301-017
- Semantic type: dropdown
- Mode behavior: values = Service Follow-up only (developer-decision-003)
- Validation: Mandatory, mandatory per row
- Sources: item-desc CMP-WCRM010301-017, dr-page Submit Validations, developer-decision-003

### Channel
- Requirement ID: CMP-WCRM010301-018
- Semantic type: dropdown
- Mode behavior: values = Call, Email, SMS (developer-decision-002)
- Validation: Mandatory, mandatory per row
- Sources: item-desc CMP-WCRM010301-018, dr-page Submit Validations, developer-decision-002

### Activity Day
- Requirement ID: CMP-WCRM010301-019
- Semantic type: number
- Mode behavior: editable textbox; blank by default
- Validation: Mandatory, numeric only, max 2 digits, range -30 to 30 (developer-decision-004)
- Sources: item-desc CMP-WCRM010301-019, dr-page Validations (Frontend Check) / Submit Validations, developer-decision-004

### Add Row — Contact grid
- Requirement ID: CMP-WCRM010301-020
- Semantic type: button
- Mode behavior: adds new row, Status = ADD
- Sources: item-desc CMP-WCRM010301-020

### Delete Row — Contact grid
- Requirement ID: CMP-WCRM010301-021
- Semantic type: icon-button
- Mode behavior: marks row Status = DEL
- Sources: item-desc CMP-WCRM010301-021, dr-page Delete Operation

### Save
- Requirement ID: CMP-WCRM010301-022
- Semantic type: button
- Mode behavior: enabled per user permissions; triggers full-form validation
- Sources: item-desc CMP-WCRM010301-022, dr-page Save Operation

## Actions / Events

### Load Screen
- Requirement ID: EVT_WCRM010301_01
- Trigger: navigation to the screen
- Preconditions: logged in with TMT role and screen access
- Frontend validation: none
- On validation failure: n/a
- Action: loads default PM configuration; Periodic Maintenance selected; existing non-deleted records displayed
- On success: screen displayed with default service intervals
- On failure: n/a
- Sources: item-desc EVT_WCRM010301_01, dr-page On-Load Operation

### Select Periodic Maintenance
- Requirement ID: EVT_WCRM010301_02
- Trigger: user selects the Periodic Maintenance radio
- Preconditions: Activity Type options available
- Frontend validation: unsaved-changes warning on switch
- Action: loads related service/inspection data
- Sources: item-desc EVT_WCRM010301_02

### Add Inspection Row
- Requirement ID: EVT_WCRM010301_03
- Trigger: click Add Row (inspection)
- Action: new row added, Status = ADD
- Sources: item-desc EVT_WCRM010301_03

### Delete Inspection Row
- Requirement ID: EVT_WCRM010301_04
- Trigger: click delete icon on inspection row
- Preconditions: at least one row exists
- Action: row marked Status = DEL, removed from list
- On success: "Selected inspection row deleted successfully"
- On failure: "Failed to delete inspection row due to system error"
- Sources: item-desc EVT_WCRM010301_04, dr-page Delete Operation

### Select Repair Code
- Requirement ID: EVT_WCRM010301_05
- Trigger: user selects a repair/inspection code
- Action: Description auto-populated
- Sources: item-desc EVT_WCRM010301_05

### Update Mandatory
- Requirement ID: EVT_WCRM010301_06
- Trigger: user toggles Mandatory checkbox
- Action: flag updated; existing row Status → UPD
- Sources: item-desc EVT_WCRM010301_06, dr-page Update Record

### Add Contact Row
- Requirement ID: EVT_WCRM010301_07
- Trigger: click Add Row (contact)
- Action: new row added, Status = ADD
- Sources: item-desc EVT_WCRM010301_07

### Enter Activity Day
- Requirement ID: EVT_WCRM010301_08
- Trigger: user enters Activity Day value
- Frontend validation: numeric only, max 2 digits, range -30 to 30
- On validation failure: "Invalid activity day value entered, please enter valid number"
- Action: value stored on row
- Sources: item-desc EVT_WCRM010301_08, developer-decision-004

### Save Activity
- Requirement ID: EVT_WCRM010301_09
- Trigger: click Save
- Preconditions: required data entered
- Frontend validation: Activity Name, at least one inspection item, Channel/Contact Process mandatory per row, Activity Day mandatory/numeric/in range, at least one contact process record, no duplicate Contact Process+Channel
- On validation failure: "Validation failed, mandatory fields missing or error occurred during saving"
- Confirmation required: Yes — "Do you want to save this activity setup?"
- Action: validates and saves; ADD/UPD/DEL rows processed accordingly
- On success: "Activity configuration saved successfully and available in Activity Master List" (HTTP 201)
- On failure: "Validation failed, mandatory fields missing or error occurred during saving"
- Sources: item-desc EVT_WCRM010301_09, dr-page Submit Validations / Save Operation / On Successful Operations

### Update Action
- Requirement ID: EVT_WCRM010301_10
- Trigger: user opens a previously created activity
- Preconditions: screen in editable state
- Confirmation required: Yes — "Do you want to save the changes?"
- Action: Activity Type radio group disabled; changes applied on Save
- On success: "Activity configuration updated successfully"
- On failure: "Validation failed, mandatory fields missing or error occurred during saving"
- Sources: item-desc EVT_WCRM010301_10

## States

- ADD — row created, not yet saved
- UPD — existing row modified, not yet saved
- DEL — row marked for deletion, removed from backend on Save

## Permissions

- Add, Delete, and Save actions are enabled based on user permissions (no specific role/permission codes documented — OQ-02).

## Acceptance Criteria

See `ui-contract.json > acceptanceCriteria` (AC-01 .. AC-10).

## Conflicts

See `ui-contract.json > conflicts` (CONF-01 .. CONF-04) — all resolved via developer decisions in `sources.md`.

## Open Questions

See `ui-contract.json > openQuestions` (OQ-01 .. OQ-04) — all non-blocking.
