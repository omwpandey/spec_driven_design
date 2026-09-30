---
agent: agent
description: Generate Cucumber BDD scenarios for a registered function, preferring the reusable generic steps.
---

# Generate a Cucumber feature

Generate a `.feature` file — and custom step definitions only if unavoidable — from the attached validated
API contract or existing function configuration. Chat-only preparation notes alone are not approved
implementation input.

Run this prompt from the Java application repository. Write feature files and step definitions only there;
never create Java application or test source files under `top-api-spec-workflow` or `top-spec-workflow`.

Reference the Java application's `docs/TESTING_GUIDE.md` when present. Generate the feature under
`{SERVICE_MODULE}/src/test/resources/features/`, resolving `{SERVICE_MODULE}` from the repository build
files. `top-demo-project/src/test/resources/features/` is only an optional reference location, not a
required destination.

## Decide the style first, and say which you chose

| Situation | Style |
|-----------|-------|
| Standard CRUD over the generic endpoints | **Generic steps — zero Java.** Default |
| Cross-entity workflow using stored ids | Generic steps |
| A chain needs a pre-existing row to lock | Custom: `Given … exists in DB:` seeding through the repository |
| Assert database state the API does not expose | Custom |
| Feature must read in business language for a BA | Custom journey steps |

Prefer generic steps. A feature needing no Java is cheaper to maintain and cannot drift from the API.

## The generic steps available

**Given (3)**

```
Given I set header {string} to {string}
Given I set variable {string} to {string}
Given I clear all stored variables
```

**When (8)**

```
When I make a {string} request to {string}
When I make a {string} request to {string} with parameters:                      → {"data": {…}}
When I make a {string} request to {string} with JSON body:
When I make a {string} request to {string} with filter parameters:               → {"filter": {…}} in the body
When I make a {string} request to {string} with query filter:                    → ?filter=…  USE FOR SEARCH
When I make a {string} request to {string} using stored value {string}
When I make a {string} request to {string} with parameters and stored values:    → ${var} cells
When I make a bulk {string} request to {string} with items:
```

**Then (18)**

```
Then the response status should be {int}
Then the response should contain key {string}
Then the response should not contain key {string}
Then the response key {string} should be {string}
Then the response key {string} should not be {string}
Then the response key {string} should be numeric
Then the response key {string} should be null
Then the response key {string} should not be null
Then the response path {string} should be {string}          → dot path, field[0] arrays
Then the response path {string} should exist
Then the response array {string} should have {int} items
Then the response array {string} should have at least {int} items
Then the response should be an array with {int} items       → root array, for bulk
Then the response should contain the following values:
Then I store response key {string} as {string}
Then I store response path {string} as {string}
Then the response should contain error message {string}
Then the response should contain error code {string}
```

Interpolation: `{var}` in a URL, `${var}` in a data-table cell.

## Required coverage

Generate a scenario for each:

1. **Happy path** for every action in the spec.
2. **Every validation rule**, asserting its error code.
3. **Every business rule** — positive and negative.
4. **Every role restriction** — a denial scenario asserting 403.
5. **Every SQL chain** — asserting the resulting **data**, by re-reading the record.
6. **Not-found** — a get on a non-existent id returns 404.
7. **Boundary cases** — max length, zero, negative, empty collection.

## Scenario rules

- Tag the feature with its module (`@inventory`) and add `@generic-steps` when it uses no custom Java.
- Resolve the service module before generating and place the feature under
  `{SERVICE_MODULE}/src/test/resources/features/`.
- One behaviour per scenario, named so a failure is self-explanatory (`A-1 JPA create — defaults applied`).
- **Seed your own data.** `TestHooks` truncates every table before each scenario, so nothing carries
  over and order never matters.
- Never assert a literal id. Store it and interpolate.
- Assert error **codes**, not message text.
- **After any write, re-read the record and assert the data.** A status-only assertion passes with a
  broken `UPDATE` — this is the most common weakness in generated tests.

## Shape

```gherkin
@{module} @generic-steps
Feature: {Function} — {what it does}
  As a {role}
  I want to {capability}
  So that {value}

  # ---------------------------------------------------------------
  # Section A — {grouping}
  # ---------------------------------------------------------------

  Scenario: A-1 {behaviour}
    When I make a "POST" request to "/v1/{FN}/create" with parameters:
      | field | value |
    Then the response status should be 200
    And the response key "status" should be "DRAFT"
    And I store response key "id" as "recordId"

    # verify persistence, not just the response
    When I make a "GET" request to "/v1/{FN}/get/{recordId}" using stored value "recordId"
    Then the response status should be 200
    And the response key "status" should be "DRAFT"
```

## Known behaviours to encode as expected, not to work around

- A business rule thrown as a bare `IllegalArgumentException` returns **500**, not 400. If the
  implementation does that, expect 500 and note in a comment that the processor should use
  `ErrorReporter` to get a 400.
- A native `UPDATE` blocked by a `WHERE` guard affects zero rows and returns **200 with unchanged data**.
  Assert the unchanged data — that is the behaviour under test.
- A native search matching exactly one row returns it in `data`, not `tableData`.
- `totalCount` is `-1` when the query has no `countSql`.
- An unknown `functionId` returns 500, not 404.

Add a comment for each such expectation explaining *why* the status is what it is, or the next reader
will "fix" the test.

## Output

The complete `.feature` file, then any custom step definition classes in full, then:

**Coverage table** — every spec item mapped to the scenario that covers it, and anything not covered
with the reason.

**How to run**

```powershell
 .\mvnw -pl {SERVICE_MODULE} test -Dtest=ProductCucumberTest -Dcucumber.filter.tags="@{module}"
```

Use the repository's actual wrapper and module selector if it differs from Maven or `{SERVICE_MODULE}`.

**Limitations** — if the feature covers locking, state that H2 does not reproduce PostgreSQL row
locking, so these scenarios verify chain execution and data correctness rather than contention.

## Do not

- Do not add a `@Component` annotation to a step definition class — Cucumber manages the instance.
- Do not use `com.fasterxml.jackson`; use `tools.jackson.databind.ObjectMapper`.
- Do not depend on data created by another scenario.
- Do not use `with parameters:` for a search — searches need `with query filter:`.
- Do not assert only the HTTP status after a write.
