# Grill: WCRM010203

**Status:** `agreed`
**DR page:** [WCRM010203] Dealer Activity Maintenance - DCM Vehicle
**URL:** https://tdem.atlassian.net/wiki/spaces/TC1/pages/1659175122/WCRM010203+Dealer+Activity+Maintenance+-+DCM+Vehicle
**Version:** 79

This is what the fetch identified to **design and implement**. Nothing below is implemented yet.
Review it. Correct it in chat if needed. Then agree before the UI contract or React work starts.

## Screens to build (UX Design only)

**One screen** — this Function Key is a single implementation pass.

| Task | Screen | Image |
|---|---|---|
| UX-001 | Init Mode | `DCM Vehicle - Dealer Update Only.png` |

## Screen logic

**Objective:** This section describes the confirmed operations for the Dealer Activity Maintenance screen, including on-load behavior, control states, validations, add, edit, delete, save, template configuration, and exit handling.

**Pre-condition:** _not found_

**Post-condition:** _not found_

## Screen modes

_No Screen Mode table found._

## Fields (page + Item_Desc)

| Field | Section | Source |
|---|---|---|
| Back | Header | item-desc:UI_Components |
| Activity Type Selection | Activity Type | item-desc:UI_Components |
| Total Vehicles in Database | Dealer Vehicle Summary | item-desc:UI_Components |
| Total Individual Customers | Dealer Vehicle Summary | item-desc:UI_Components |
| Total Corporate Customers | Dealer Vehicle Summary | item-desc:UI_Components |
| Activity ID | Activity Setup | item-desc:UI_Components |
| Activity Name | Activity Setup | item-desc:UI_Components |
| Activity Description | Activity Setup | item-desc:UI_Components |
| Customer Type | Activity Setup | item-desc:UI_Components |
| Suppress Days | Activity Setup | item-desc:UI_Components |
| Select Item | DCM Vehicle Item | item-desc:UI_Components |
| No. | DCM Vehicle Item | item-desc:UI_Components |
| Status | DCM Vehicle Item | item-desc:UI_Components |
| Items | DCM Vehicle Item | item-desc:UI_Components |
| Mileage | DCM Vehicle Item | item-desc:UI_Components |
| Duration/Period | DCM Vehicle Item | item-desc:UI_Components |
| Mandatory | DCM Vehicle Item | item-desc:UI_Components |
| Add Contact Channel | Contact Channel Details | item-desc:UI_Components |
| No. | Contact Channel Details | item-desc:UI_Components |
| Status | Contact Channel Details | item-desc:UI_Components |
| Contact Process | Contact Channel Details | item-desc:UI_Components |
| Channel | Contact Channel Details | item-desc:UI_Components |
| Activity Day | Contact Channel Details | item-desc:UI_Components |
| Assign Group | Contact Channel Details | item-desc:UI_Components |
| Action | Contact Channel Details | item-desc:UI_Components |
| Delete Activity | Footer | item-desc:UI_Components |
| Set Template | Footer | item-desc:UI_Components |
| Save | Footer | item-desc:UI_Components |

## Actions / buttons / events

| Action | State / note | Source |
|---|---|---|
| EVT-001 On Load | System loads Setup Activity by Dealer screen. When user selects Activity Type = DCM Vehicle, the system dynamically loads Activity ID, Activity Name, Activity D | item-desc:UI_Events |
| EVT-002 On Change – Activity Type | System loads the configuration associated with the selected Activity Type. If unsaved changes exist, the system displays a warning message before changing the A | item-desc:UI_Events |
| EVT-003 On Change – Activity Description | System updates the Activity Description value in screen memory. Updated data will be persisted through API_003 (Save Setup Activity). | item-desc:UI_Events |
| EVT-004 On Change – Customer Type | System updates the selected Customer Type for the activity setup. Dropdown values are loaded using CMB-001 (Get Customer Type). Updated data will be persisted t | item-desc:UI_Events |
| EVT-005 On Check/Uncheck – DCM Vehicle Item | System updates the selected DCM Vehicle Item for the activity configuration. DCM Vehicle Items including Item Name, Mileage, Duration/Period, and Mandatory info | item-desc:UI_Events |
| EVT-006 On Click – Add Contact Channel | System adds a new editable row to the Contact Channel Details grid and assigns the next sequence number. Status is set to ADD. Data entry will be saved using AP | item-desc:UI_Events |
| EVT-007 On Change – Contact Process | System updates the selected Contact Process. When Contact Process = Appointment Confirmation, system automatically sets Activity Day = -1 and makes the Activity | item-desc:UI_Events |
| EVT-008 On Change – Channel | System updates the selected communication channel. Channel dropdown values are loaded based on the selected Contact Process. Updated data will be persisted thro | item-desc:UI_Events |
| EVT-009 On Change – Activity Day | System validates and stores Activity Day. For Service Follow-up, Activity Day must be between -30 and +30. For Appointment Confirmation, Activity Day is automat | item-desc:UI_Events |
| EVT-010 On Change – Assign Group | System updates the selected Assign Group for the Contact Channel record. Assign Group values are loaded using CMB-004. Updated data will be persisted through AP | item-desc:UI_Events |
| EVT-011 On Click – Delete Contact Channel | System marks the selected Contact Channel row for deletion. Existing records are marked as DEL, while newly added unsaved rows are removed from the grid. Change | item-desc:UI_Events |
| EVT-012 On Click – Delete Activity | System displays a confirmation message. Upon confirmation, the selected DCM Vehicle Activity is marked as INACTIVE using API_004. No future call plans will be g | item-desc:UI_Events |
| EVT-013 On Click – Set Template | System opens Template Selection popup/screen and allows the user to select a predefined communication template. Upon selection, the system populates Contact Cha | item-desc:UI_Events |
| EVT-014 On Click – Save | System validates Activity ID, Activity Description, Customer Type, Suppress Days, validates at least one DCM Vehicle Item is selected, validates at least one Co | item-desc:UI_Events |
| EVT-015 On Navigate Away With Unsaved Changes | System checks whether any unsaved changes exist before navigating to another Activity Type, screen, menu, or link. If unsaved changes exist, a warning message i | item-desc:UI_Events |

## Access

_No Access Control table found._

## APIs (from workbook)

- API_001 (data-map:DB_Entity)
- API_003 (data-map:DB_Entity)
- API_004 (data-map:DB_Entity)
- API_002 (data-map:DB_Entity)
- API_005 (data-map:DB_Entity)
- API_006 (data-map:DB_Entity)
- API_007 (data-map:DB_Entity)
- CMB-001 (data-map:DB_Entity)
- CMB-004 (data-map:DB_Entity)
- CMB-002 (data-map:DB_Entity)
- CMB-003 (data-map:DB_Entity)

## UX images (UX Design section only)

- `DCM Vehicle - Dealer Update Only.png` (Init Mode)

## Workbooks

- Item_Desc_*: `Item_Desc_DCM_VehicleDealer.xlsx`
- API_Data_Map_Details_*: **missing**
- DATA_MAP_*: `DATA_MAP_DCM_Vehicle_Dealer_WCRM010203.xlsx`

## Missing from attachments

- API_Data_Map_Details_*

## Agree

If this list is wrong, say what to drop or add. Do not start React until status is `agreed`.

```bash
npm run feature:grill -- WCRM010203 --agree --by "<your name>"
```

Agreed by **Om Pandey** at 2026-08-30T07:17:17.018Z.
Notes: Build UX-001 Init Mode only (DCM Vehicle - Dealer Update Only). Dropped UX-002 Add Mode.
