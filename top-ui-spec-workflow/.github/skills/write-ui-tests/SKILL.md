---
name: write-ui-tests
description: Write UI tests and specs/<FUNCTION_KEY>/test-report.md from acceptanceCriteria on ui-contract.json. Use after the page exists. Do not change the page or the contract.
argument-hint: "[function key]"
---

# Write UI tests

Owner: Test Script Developer.

Read:

```text
specs/<FUNCTION_KEY>/ui-contract.json
specs/<FUNCTION_KEY>/review.md
src/modules/<FUNCTION_KEY>/
```

Do not reread Confluence or `raw/`. Do not read `requirements.md`, `design.md`, `tasks.md`, `acceptance.md`, or `decisions.md`.

## Procedure

1. List every `acceptanceCriteria` id on the UI contract.
2. For each id, write one test for the stated precondition, action, and expected result. Skip an item only when an open question marks it blocking, and say so in the report.
3. Put component tests beside the page under `src/modules/<FUNCTION_KEY>/`. Put service tests beside `src/services/<FUNCTION_KEY>Service.ts`.
4. Use the test setup that already exists in the application. Do not add a new test library.
5. Run the project's existing test command for that screen.
6. Write `specs/<FUNCTION_KEY>/test-report.md` with one row per acceptance id: test name, pass or fail, and a note when the test was skipped.

Do not change production code to make a test pass. Report the failure and stop.
