# Grill: WCRM020104

**Status:** `pending_review`
**DR page:** [WCRM020104] Call Plan Allocation By Enquiry agenticDR
**URL:** https://tdem.atlassian.net/wiki/spaces/TC1/pages/1698660405/WCRM020104+Call+Plan+Allocation+By+Enquiry+agenticDR
**Version:** 2

This is what the fetch identified to **design and implement**. Nothing below is implemented yet.
Review it. Correct it in chat if needed. Then agree before the UI contract or React work starts.

## Screens to build (UX Design only)

**One screen** — this Function Key is a single implementation pass.

| Task | Screen | Image |
|---|---|---|
| UX-001 | Screen UX | `Call Plan Allocation by Enquiry-20260803-102643.png` |

## Screen logic

**Objective:** The Call Plan Allocation by Enquiry function allows users to view, manage, and reassign manually created call plans that are not generated through Night Batch Processing, Activity Configuration, Activity Setup modules, or Automated Call Plan Generation processes.

This screen is specifically designed for call plans created through customer enquiries, inbound calls, missed call callbacks, customer follow-up requests, callback requests, and manually scheduled follow-up activities (for example: a customer calls the dealership and requests a follow-up, a dealer receives a missed call and performs 

**Pre-condition:** - User must be logged into the CRM system with valid credentials.

- Dealer User access shall be controlled through the Role Function Matrix; user must have the applicable access (View Screen, Search, Reassign Call Plans, Save Allocation) as per role.

- TMT User access shall be controlled through the authorization matrix.

- Manually created enquiry call plans (from customer enquiries, inbound ca

**Post-condition:** - On successful Save, the selected enquiry call plan record(s) shall be reassigned to the selected destination staff (Assign Selected Customer To).

- The assigned Staff Name (PIC) shall be updated for all selected records; Branch value and Call History shall remain unchanged.

- The search result grid shall automatically refresh after reassignment and Save.

## Screen modes

| Mode | Section | Description |
|---|---|---|
| Initial Mode | Search Area | On page load, none of the search criteria are mandatory. Group Name defaults to blank, Staff Name defaults to All, Branch defaults to All (or per user authorization), Follow-up Date defaults to blank. |
| Search Mode | Search Area | User enters/changes Group Name, Staff Name, Branch, and/or Follow-up Date and clicks Search. None of the criteria are mandatory. |
| Reset Mode | Search Area | Reset clears all search criteria: Group Name becomes blank, Staff Name returns to All, Branch returns to its default value, Follow-up Date becomes blank. |

## Fields (page + Item_Desc)

| Field | Section | Source |
|---|---|---|
| Follow-up Date | Grid Section | dr-page:Display Order |
| Group Name | Search Area | item-desc:ui-components |
| Staff Name | Search Area | item-desc:ui-components |
| Branch | Search Area | item-desc:ui-components |
| Search | Search Area | item-desc:ui-components |
| Reset | Search Area | item-desc:ui-components |
| Selection Checkbox | Grid Section | item-desc:ui-components |
| No. | Grid Section | item-desc:ui-components |
| Customer Name - Surname | Grid Section | item-desc:ui-components |
| Car Model (Car Registration) | Grid Section | item-desc:ui-components |
| Staff Name (PIC) | Grid Section | item-desc:ui-components |
| Assign Selected Customer To | Action Section | item-desc:ui-components |
| Save | Action Section | item-desc:ui-components |
| Rows Per Page | Pagination | item-desc:ui-components |
| Go To Page | Pagination | item-desc:ui-components |
| First/Prev/Next/Last | Pagination | item-desc:ui-components |

## Actions / buttons / events

| Action | State / note | Source |
|---|---|---|
| EVT_001 OnLoad | Load Call Plan Allocation by Enquiry screen; initialize search defaults; display enquiry call plans within authorization scope sorted by Follow-up Date ASC with | item-desc:ui-events |
| EVT_002 Search | Search enquiry call plans using selected Group Name, Staff Name, Branch, and/or Follow-up Date within authorization scope; refresh grid and pagination | item-desc:ui-events |
| EVT_003 Reset | Reset search criteria to defaults and reload all enquiry call plans in authorization scope; clear grid selections and destination staff | item-desc:ui-events |
| EVT_004 Select | User selects one or more grid rows (including across pages) for reassignment | item-desc:ui-events |
| EVT_005 Change | User selects destination staff in Assign Selected Customer To dropdown | item-desc:ui-events |
| EVT_006 Save | Validate selected rows and destination staff; confirm; update PIC for selected enquiry call plans in one transaction; refresh grid | item-desc:ui-events |
| EVT_007 Pagination | Change page size or navigate First/Previous/Next/Last/Go To Page without changing search criteria or sort | item-desc:ui-events |

## Access

| Role | Screen Access |
| --- | --- |
| Dealer Management User | Y &mdash; as per Role Function Matrix |
| Manager | Y &mdash; as per Role Function Matrix |
| Call Center Staff | View Only / As per role matrix; reassignment as per authorization matrix |
| TMT User | Controlled through authorization matrix |

## APIs (from workbook)

- API-CPA-001 (api-map:API_Details)
- API-CPA-002 (api-map:API_Details)
- API-CPA-003 (api-map:API_Details)
- API-CPA-004 (api-map:API_Details)
- API-CPA-005 (api-map:API_Details)
- API-CPA-006 (api-map:API_Details)

## UX images (UX Design section only)

- `Call Plan Allocation by Enquiry-20260803-102643.png` (Screen UX)

## Workbooks

- Item_Desc_*: `Item_Desc_Call_Plan_Allocation_by_Enquiry.xlsx`
- API_Data_Map_Details_*: `API_Data_Map_Details_Call_Plan_Allocation_By_Enquiry.xlsx`
- DATA_MAP_*: **missing**

## Missing from attachments

- DATA_MAP_*

## Agree

If this list is wrong, say what to drop or add. Do not start React until status is `agreed`.

```bash
npm run feature:grill -- WCRM020104 --agree --by "<your name>"
```
