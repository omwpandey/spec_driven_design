# Spec policy

GitHub Copilot is the host. Follow this file, then the one agent for the step you are on. Each agent writes only its own files.

One Function Key has one agreement and two contracts. The contracts are the specification. They carry the facts that used to be copied into separate requirements, design, task, acceptance, and decision files.

## What each file is for

| File | Keeps |
|---|---|
| `raw/` | The published DR: page, UX Design images, and workbooks. Agents do not edit it and do not reread Confluence after fetch. |
| `grill.json` | The agreement. Page id, version, URL, fields, actions, API ids, validation rules, missing items, and who agreed. Validation rules are stored once, with their source. |
| `grill.md` | The same grill, for a person to review. |
| `sources.md` | Stable source ids (`dr-page`, `ux-image`, `item-desc`, `api-map`, `data-map`, `developer-decision-001`). |
| `feature.md` | A one-page summary that points at the contracts. It does not restate every field. |
| `ui-contract.json` | Screen facts: fields, validations, actions, states, permissions, `acceptanceCriteria`, `conflicts`, `openQuestions`, each with `sourceRefs`. |
| `api-contract.json` | API facts: one `apis` entry per identified API (`id`, `method`, `path`, `requestExample`, `responseExample`, errors), plus entities and acceptance criteria that the DR supports, each with `sourceRefs`. |
| `contract-map.json` | Which UI field or action calls which `apiId`. |
| `component-map.json` | Which catalog component implements each field or action, and why. |
| `review.md` | The UI review verdict. |
| `test-report.md` | The UI test result against `acceptanceCriteria`. |

A product change that is not in the DR is an agreement note on `grill.json`, then a `developer-decision-NNN` source on the contract. It is not a new markdown spec.

`requirements.md`, `design.md`, `tasks.md`, `acceptance.md`, and `decisions.md` are not part of this policy. Leave old copies in place. Do not read them, update them, or create them for a new Function Key.

## UI agents

Run fetch and agree from `top-spec-workflow`. Run UI validation from `top-ui-spec-workflow`. Select one agent in Copilot. The skill on that agent is the procedure.

| Agent | Skill | Writes | Stops before |
|---|---|---|---|
| UI Requirement Analyst | `grill-ui-requirement`, then `analyze-ui-requirement` | agreed `grill.json`, then `sources.md`, `feature.md`, `ui-contract.json` | Choosing a React component or editing `src/` |
| UI Architect | `component-discovery` | `component-map.json` | Writing the page |
| UI Developer | `build-react-page` | the page, styles, module index, and feature service | Changing the contract or the component map |
| UI Reviewer | `ui-review` | `review.md` | Editing `src/` |
| Test Script Developer | `write-ui-tests` | test scripts and `test-report.md` | Changing the page or the contract |

### 1. UI Requirement Analyst

```bash
cd top-spec-workflow
npm run feature:fetch -- --url "<DR_URL>"
```

Open `specs/<FUNCTION_KEY>/grill.md`. Check the page version, UX Design screens, fields, actions, API ids, validation rules, and the missing list. Then:

```bash
npm run feature:grill -- <FUNCTION_KEY> --agree --by "<name>"
```

One agreement covers the screen and the APIs. `--ui` and `--api` do not create a second grill.

After agreement, write `sources.md`, `feature.md`, and `ui-contract.json` from `raw/` and the agreed grill. Copy validation rules from `grill.json`. Leave `screen.api` empty until `contract-map.json` exists.

### 2. API Contract Analyst

This agent lives in `top-api-spec-workflow`. It is not one of the five UI agents.

From the same `grill.json` and `raw/` API sheets, write `api-contract.json` and `contract-map.json`. Copy the validation list from the grill. Do not invent a method, path, or response example.

The UI Requirement Analyst then copies `method`, `path`, and `responseExample` into `ui-contract.json` `screen.api` from that map.

```bash
cd top-ui-spec-workflow
npm run feature:validate -- <FUNCTION_KEY>
```

### 3. UI Architect

Write `component-map.json` from the UI contract and `src/components/COMPONENT_CATALOG.md`. Do not implement the page.

```bash
npm run component-map:validate -- <FUNCTION_KEY>
```

### 4. UI Developer

Implement only:

```text
src/modules/<FUNCTION_KEY>/<PascalCase>Page.tsx
src/modules/<FUNCTION_KEY>/<name>.styles.ts
src/modules/<FUNCTION_KEY>/index.ts
src/services/<FUNCTION_KEY>Service.ts
```

Screen generation waits until `screen.api` has `id`, `method`, `path`, and `mockResponse`. The component map does not wait for Java.

```bash
npm run ui:guard
npm run ui:harness -- <FUNCTION_KEY>
```

### 5. UI Reviewer

Write only `specs/<FUNCTION_KEY>/review.md`. Compare the page with `ui-contract.json`, `component-map.json`, and `acceptanceCriteria` on the contract.

### 6. Test Script Developer

Write tests for `acceptanceCriteria` on the UI contract, and write `specs/<FUNCTION_KEY>/test-report.md`. Do not change the page or the contract.

Java implementation is a later handoff in `top-api-spec-workflow`. It reads `api-contract.json` only. It does not start a new requirements pass.

## Context that must move forward

- Page id, version, and URL stay on `grill.json`.
- Every field, action, and API id keeps the source string from the grill.
- Every validation rule keeps its rule, message, and source. The UI contract and the API contract copy that list. They do not each own a grill.
- Unknowns stay in `openQuestions` with `blocking: true` when building would require inventing a business rule.
- Contradictions stay in `conflicts`.
- The agreement records the person, the time, and the note.
