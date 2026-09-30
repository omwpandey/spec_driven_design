# WCRM010203 — Dealer Activity Maintenance - DCM Vehicle (Init Mode)

## Summary

**UX-001 Init Mode** only (Dealer Update Only). Add Mode mockup is out of scope (`developer-decision-002`). Dealer maintains an existing DCM Vehicle activity: type, setup, TMT items, contact channels, save/delete/template/back.

## Sources

See `sources.md`.

## Screen

- Name: Dealer Activity Maintenance - DCM Vehicle
- Route: unknown
- Mode in this pass: `init` (UX Design caption “Init Mode”; filename Update Only)
- Breadcrumb visible on mockup: Activity Setup > Activity List > Dealer Activity Maintenance

## UI Structure (visible on UX-001)

1. Back
2. Activity Type radios (DCM Vehicle selected) + three summary cards (counts and percentages)
3. Activity Setup: Activity ID AV260001 (read-only), Name, Description, Customer Type, Suppress Days 90
4. DCM Vehicle Item grid (one selected row, STATUS ADD)
5. Contact Channel Details + Add; rows with ADD/UPD; delete icons
6. Footer: Delete Activity, Set Template, Save

App header/sidebar on the mockup are shell, not this Function Key.

## Fields / Actions

See `ui-contract.json`. Item_Desc UI-DCM-001–028 and EVT-001–015. Do not implement Add Mode entry path in this pass.

## Conflicts / Open Questions

See contract. Blocking: API map, Activity Day range, Activity Name editability, Assign Group rule, Set Template behavior, permissions, whether Init Mode locks Activity Type (EVT-001 edit vs all types visible on mockup).
