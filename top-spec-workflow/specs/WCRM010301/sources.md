# WCRM010301 Sources

Fetched from published DR. Status: agreed (grill) → normalized into `ui-contract.json`.

| ID | Type | Locator |
|---|---|---|
| `dr-page` | Confluence page (v133) | [WCRM010301] TMT Activity Maintenance - PM — `raw/page.md` |
| `ux-image` | UX Design image | `raw/images/Periodic Maintenance - TMT-20260831-144226.png` (UX-001) |
| `item-desc` | Item_Desc workbook | `raw/sheets/Item_Desc.md` — sheets `UI_Components` (CMP-WCRM010301-001..022), `UI_Events` (EVT_WCRM010301_01..10) |
| `data-map` | DATA_MAP workbook | `raw/sheets/DATA_MAP.md` — sheets `DB_Entity`, `DB_Columns`, `API_Field_DB_Mapping` (API-WCRM010301-001..005) |
| `developer-decision-001` | Developer clarification (grill session, 2026-09-15) | Approver: Om Pandey — Exclude "Set Template" button/dialogs (SMS/Email/Line OA template config) from this task; not backed by Item_Desc UI_Components/UI_Events, only narrative page.md text + mockup image. Separate task. |
| `developer-decision-002` | Developer clarification (grill session, 2026-09-15) | Approver: Om Pandey — Contact Channel "Channel" dropdown values authoritative: Call, Email, SMS (per `dr-page` narrative text), overriding `item-desc` CMP-018 behavior note (Email, TMT LON) and `ux-image` sample rows (Email, SMS). |
| `developer-decision-003` | Developer clarification (grill session, 2026-09-15) | Approver: Om Pandey — Contact Process dropdown values authoritative: Service Follow-up only (per `dr-page` text + `ux-image`), overriding `item-desc` CMP-017 behavior note (Service Followup + Appointment Confirmation). |
| `developer-decision-004` | Developer clarification (grill session, 2026-09-15) | Approver: Om Pandey — Activity Day validation range authoritative: -30 to 30 flat (per `dr-page` general validation text), overriding `item-desc` CMP-019 behavior note (per-process ranges -1 to -30 / 1 to 30). |

## Missing

- `API_Data_Map_Details_*` workbook (endpoint paths, HTTP methods, request/response schemas) was not attached to the DR. Only API IDs (`API-WCRM010301-001..005`) and field-to-column mappings are known from `data-map`.
