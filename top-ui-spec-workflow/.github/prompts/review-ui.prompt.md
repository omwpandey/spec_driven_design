---
name: review-ui
description: Review a feature against ui-contract.json and component-map.json. Write only specs/<ID>/review.md.
argument-hint: Story ID=<id>
target: vscode
---

# Review UI

Select the **UI Reviewer** agent.

Read review inputs from `TOP_UI_SPEC_ROOT/<STORY-ID>/`, normally `../top-spec-workflow/specs/<STORY-ID>/`.

Follow the `ui-review` skill and [specs/guides/PHASE-2.md](../../../top-spec-workflow/specs/guides/PHASE-2.md).

Write only `specs/<STORY-ID>/review.md`. FAIL if mapped catalog components are unused and raw MUI is used instead. Do not change `src/`.
