# Requirement Extraction Rules

## Do not assume source precedence

The published DR page, Item_Desc / API / DATA_MAP workbooks, UX images, and existing code may disagree. Unless project governance explicitly defines precedence, record disagreement rather than choosing. The agreed `grill.md` is the developer-approved identification, not extra business rules.

## UX evidence may establish

- visible controls and labels;
- relative placement and grouping;
- visible icons;
- visible required marker;
- visible enabled/disabled appearance;
- visible modal/state represented in the image.

UX alone does not establish regex, max length unless visibly documented, API/service/DB details, permissions, hidden behavior, or unseen event side effects.

## Source locators

Use the narrowest locator possible: `dr-page > Button Settings > Save`, `item-desc > ui-components > row`, `UX image > footer > Save`, exact approved code file/symbol, or explicit developer decision.

## Existing code

Existing code is implementation precedent. Do not promote it into a new business rule unless the source material explicitly requires existing behavior.

## Developer clarification

When a developer resolves ambiguity, add a decision source and cite it from the resolved rule.

## Traceability required for

Validations, permissions, action/event behavior, acceptance criteria, destructive behavior, and business-significant mode-specific editability.
