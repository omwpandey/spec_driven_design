---
name: fetch-requirements
description: Fetch a published Confluence DR by URL or Function Key, then grill the identified UI/logic until the developer agrees.
argument-hint: URL=<confluence-url> or Function Key=<key>
target: vscode
---

# Fetch published DR

Accept a Confluence URL (`/pages/<id>`) or a Function Key (example: `WCRM020104`). If only a URL is given, fetch derives the Function Key from the page title or slug. Do not ask for a Jira key. Do not require `agenticDR` in the title.

Write/read feature artifacts from `TOP_UI_SPEC_ROOT/<FUNCTION_KEY>/`, normally `../top-spec-workflow/specs/<FUNCTION_KEY>/`. Do not use a local `top-ui-spec-workflow/specs/` folder.

Run these commands from `top-spec-workflow`:

```bash
cd ../top-spec-workflow
npm run feature:fetch -- --url "<DR_URL>"
npm run feature:fetch -- <FUNCTION_KEY>
```

Then follow the `grill-ui-requirement` skill and [specs/guides/PHASE-0.md](../../../top-spec-workflow/specs/guides/PHASE-0.md). Do not implement React. Do not write `ui-contract.json` until the developer agrees.
