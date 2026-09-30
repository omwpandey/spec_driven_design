# Grill: WCRM010301

**Status:** `agreed`
**DR page:** [WCRM010301] TMT Activity Maintenance - PM
**URL:** https://tdem.atlassian.net/wiki/spaces/TC1/pages/1646690475/WCRM010301+TMT+Activity+Maintenance+-+PM
**Version:** 133

This is what the fetch identified to **design and implement**. Nothing below is implemented yet.
Review it. Correct it in chat if needed. Then agree before the UI contract or React work starts.

## Screens to build (UX Design only)

**One screen** — this Function Key is a single implementation pass.

| Task | Screen | Image |
|---|---|---|
| UX-001 | Screen UX | `Periodic Maintenance - TMT-20260831-144226.png` |

## Screen logic

**Objective:** This section describes confirmed operations for the Setup Activity &ndash; Periodic Maintenance (TMT) screen based on the uploaded template details.

**Pre-condition:** _not found_

**Post-condition:** _not found_

## Screen modes

_No Screen Mode table found._

## Fields (page + Item_Desc)

| Field | Section | Source |
|---|---|---|
| Periodic Maintenance | Activity Type | item-desc:UI_Components |
| Additional Rejected Job | Activity Type | item-desc:UI_Components |
| DCM Vehicle | Activity Type | item-desc:UI_Components |
| TCFR+ | Activity Type | item-desc:UI_Components |
| SSC/SCS | Activity Type | item-desc:UI_Components |
| Body & Paint | Activity Type | item-desc:UI_Components |
| BP Insurance Renewal | Activity Type | item-desc:UI_Components |
| Upload | Activity Type | item-desc:UI_Components |
| Post Service Follow Up (PSFU) | Activity Type | item-desc:UI_Components |
| Status | Common | item-desc:UI_Components |
| NO. | Service & Repair Inspection | item-desc:UI_Components |
| Repair/Inspection Code | Service & Repair Inspection | item-desc:UI_Components |
| Description | Service & Repair Inspection | item-desc:UI_Components |
| Mandatory | Service & Repair Inspection | item-desc:UI_Components |
| Action | Service & Repair Inspection | item-desc:UI_Components |
| Add Row | Service & Repair Inspection | item-desc:UI_Components |
| Contact Process | Contact Channel Details | item-desc:UI_Components |
| Channel | Contact Channel Details | item-desc:UI_Components |
| Activity Day | Contact Channel Details | item-desc:UI_Components |
| Add Row | Contact Channel Details | item-desc:UI_Components |
| Delete Row | Contact Channel Details | item-desc:UI_Components |
| Save | Footer | item-desc:UI_Components |

## Actions / buttons / events

| Action | State / note | Source |
|---|---|---|
| EVT_WCRM010301_01 Load Screen | System loads Setup Activity screen with default PM configuration | item-desc:UI_Events |
| EVT_WCRM010301_02 Select Periodic Maintenance | User selects the "Periodic Maintenance" radio button | item-desc:UI_Events |
| EVT_WCRM010301_03 Add Inspection Row | User clicks Add Row to add inspection | item-desc:UI_Events |
| EVT_WCRM010301_04 Delete Inspection Row | User deletes  inspection row | item-desc:UI_Events |
| EVT_WCRM010301_05 Select Repair Code | User selects repair/inspection code | item-desc:UI_Events |
| EVT_WCRM010301_06 Update Mandatory | User updates mandatory checkbox | item-desc:UI_Events |
| EVT_WCRM010301_07 Add Contact Row | User clicks Add Row in contact section | item-desc:UI_Events |
| EVT_WCRM010301_08 Enter Activity Day | User enters activity day numeric value only | item-desc:UI_Events |
| EVT_WCRM010301_09 Save Activity | User clicks Save to store configuration | item-desc:UI_Events |
| EVT_WCRM010301_10 Update Action | User opens the created activity by TMT then Radio button will be disabled and Activity Type cannot be changed | item-desc:UI_Events |

## Access

_No Access Control table found._

## APIs (from workbook)

- API-WCRM010301 (data-map:DB_Entity)

## UX images (UX Design section only)

- `Periodic Maintenance - TMT-20260831-144226.png` (Screen UX)

## Workbooks

- Item_Desc_*: `Item_desc_Periodic_Maintenance(Activity_Master_Maintenance)_TMT_301 (3) (1).xlsx`
- API_Data_Map_Details_*: **missing**
- DATA_MAP_*: `Data_Map_Periodic_Maintenance(Activity_Master_Maintenance)_TMT (2) (2) (1) (2) 1 (1) (1).xlsx`

## Missing from attachments

- API_Data_Map_Details_*

## Agree

If this list is wrong, say what to drop or add. Do not start React until status is `agreed`.

```bash
npm run feature:grill -- WCRM010301 --agree --by "<your name>"
```

Agreed by **Om Pandey** at 2026-09-15T10:20:26.755Z.

