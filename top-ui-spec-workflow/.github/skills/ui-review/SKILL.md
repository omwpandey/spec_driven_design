---
name: ui-review
description: Review a React feature against its ui-contract.json and component-map.json. Write specs/<ID>/review.md. Fail when mapped src/components exports are unused and raw MUI controls are used instead. Do not reread Confluence.
argument-hint: "[story id]"
context: fork
---

# UI Review

Read/write spec review artifacts under `TOP_UI_SPEC_ROOT/<STORY-ID>/`, normally `../top-spec-workflow/specs/<STORY-ID>/`. Treat `specs/<STORY-ID>/...` below as shorthand for that shared specs root.

Read only:

```text
`specs/<STORY-ID>/ui-contract.json`
`specs/<STORY-ID>/component-map.json`
changed implementation files
relevant src/components definitions and usages (catalog under form/common/layout/table; new screens under screens/<SCREEN_ID>/)
```

Do not reread Jira, Confluence, or `raw/` by default. Do not modify production code. The only allowed write is:

```text
specs/<STORY-ID>/review.md
```

Run when possible:

```bash
npm run feature:validate -- <STORY-ID>
npm run component-map:validate -- <STORY-ID>
npm run ui:guard
```

## FAIL when

- A mapped catalog export (`SaveButton`, `FormTextField`, `DataTable`, …) is unused and the page uses raw MUI `Button` / `TextField` / `Select` / `Table` / `IconButton` / `Dialog` instead
- A generated page is not under `src/modules/<FUNCTION_KEY>/` or is not named `*Page.tsx` with a sibling `.styles.ts` and `index.ts` (existing `*Page.tsx` as-built files are exempt)
- A new file ignores S&G §5 naming in `.github/instructions/react.instructions.md` (`handle{Event}`, `is`/`has`/`should`, UPPER_SNAKE_CASE constants)
- A contract field, action, validation, or acceptance criterion is unimplemented without an open question
- Business behavior was invented (copy, validation, API, permissions)
- `ui:guard` fails and the file is not a documented `allowFiles` exception
- Grill exists and is not `agreed`

## WARNING when

- `page-specific` / `new-shared` is justified but a catalog alternative is close
- Accessibility gaps (unlabeled controls, actions outside the form, missing live regions)
- Shared component defaults were overridden without need
- States exist in code but are unreachable

## PASS when

- Contract coverage holds, catalog reuse matches the map, pages stay thin, and validators pass

## Report format

Write `review.md` with overall verdict **PASS**, **WARNING**, or **FAIL**, then grouped findings. Return a short summary to the parent (verdict + FAIL/WARNING counts + path to `review.md`).
