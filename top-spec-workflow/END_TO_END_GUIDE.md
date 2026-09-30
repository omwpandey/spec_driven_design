# End-to-End Spec-Driven Development

Use this sequence for one Function Key, for example `WCRM020104`.

## Repository responsibilities

1. `top-spec-workflow` owns shared DR evidence, scope agreement, requirements, design, decisions, tasks, and acceptance criteria.
2. `top-ui-spec-workflow` owns the UI contract, component map, React implementation gates, and UI review.
3. `top-api-spec-workflow` owns the API contract, Java implementation guidance, API tests, and Java review.

All feature artifacts are stored in one shared folder:

```text
TOP_SPEC_ROOT/<FUNCTION_KEY>/
```

In this workspace, that is:

```text
C:\Users\Om.Pandey\Coforge_Toyota\spec_driven_ui_development\top-spec-workflow\specs\<FUNCTION_KEY>\
```

Do not create another `specs` folder inside either technology workflow repository.

## 0. Prepare the workspace

Open the repository that contains the agent you want to use. In VS Code:

1. Open Chat.
2. Select **Agent** mode.
3. Select the named custom agent below.
4. Paste the agent command shown for that step.
5. Review the files it changes before moving to the next agent.

The agent command means the instruction you paste into chat. It is not a PowerShell command.

Set this variable when using the shared Phase 0 scripts:

```powershell
$env:TOP_SPEC_ROOT = "C:\Users\Om.Pandey\Coforge_Toyota\spec_driven_ui_development\top-spec-workflow\specs"
```

## 1. Shared requirements: `top-spec-workflow`

The fetch, init, and grill scripts live in `top-spec-workflow` and write directly to its shared `specs` directory.

### 1.1 Fetch the DR

In the `top-spec-workflow` terminal:

```powershell
Push-Location top-spec-workflow
$env:TOP_SPEC_ROOT = "${PWD}\specs"
npm install
npm run feature:fetch -- --url "<DR_URL>"
# Or, when the Function Key is known:
# npm run feature:fetch -- <FUNCTION_KEY>
Pop-Location
```

### 1.2 Review and agree the grill

Select **UI Requirement Analyst** from `top-ui-spec-workflow/.github/agents/`.

Paste:

```text
Function Key=<FUNCTION_KEY>
Fetch the published DR, review raw/ and grill.md, and stop for my agreement.
Do not write ui-contract.json or React code.
```

Review:

```text
specs/<FUNCTION_KEY>/raw/
specs/<FUNCTION_KEY>/grill.md
specs/<FUNCTION_KEY>/grill.json
```

Check the DR version, screens, fields, actions, APIs, missing data, and whether the screen already exists. Do not invent missing requirements.

When the grill is correct, run this terminal command:

```powershell
Push-Location top-spec-workflow
$env:TOP_SPEC_ROOT = "${PWD}\specs"
npm run feature:grill -- <FUNCTION_KEY> --agree --by "<name>"
Pop-Location
```

Required gate:

```text
grill.json.status = agreed
```

### 1.3 Complete shared artifacts

Use the agreed evidence to maintain these technology-neutral files:

```text
specs/<FUNCTION_KEY>/
  grill.json
  grill.md
  raw/
  sources.md
  feature.md
  requirements.md
  design.md
  tasks.md
  acceptance.md
  decisions.md
```

Keep conflicts and unresolved behavior explicit. This step is complete only when the shared requirements, design, tasks, and acceptance criteria are reviewable.

## 2. UI branch: `top-ui-spec-workflow`

Open `top-ui-spec-workflow` in VS Code and set `TOP_UI_APP_ROOT` and `TOP_UI_SPEC_ROOT`.

### 2.1 Create the UI contract

Select **UI Requirement Analyst**.

Paste:

```text
Function Key=<FUNCTION_KEY>
grill.json is agreed. Create or update sources.md, feature.md, and ui-contract.json from raw/ and grill.md.
Do not implement React and do not choose components.
```

Run:

```powershell
npm run feature:validate -- <FUNCTION_KEY>
```

Required output: `ui-contract.json` is valid and source-backed.

### 2.2 Create the component map

Select **UI Architect**.

Paste:

```text
Story ID=<FUNCTION_KEY>
Create component-map.json from ui-contract.json and top-ui/src/components/COMPONENT_CATALOG.md.
Map every field and action. Do not implement the page yet.
```

Run:

```powershell
npm run component-map:validate -- <FUNCTION_KEY>
```

Review the map and confirm that reuse/configure/compose decisions have real catalog exports and that new shared or page-specific decisions have rationales.

### 2.3 Implement the React page

Select **UI Architect** again.

Paste:

```text
Story ID=<FUNCTION_KEY>
Implement the agreed feature from ui-contract.json and component-map.json in top-ui.
Reuse src/components and existing services. Do not reread Confluence. Do not invent requirements, validation, endpoints, or copy.
Run the feature validation, component-map validation, ui:guard, and ui:harness checks after implementation.
```

Expected generated files:

```text
top-ui/src/modules/<FUNCTION_KEY>/<PascalCase>Page.tsx
top-ui/src/modules/<FUNCTION_KEY>/<name>.styles.ts
top-ui/src/modules/<FUNCTION_KEY>/index.ts
top-ui/src/services/<FUNCTION_KEY>Service.ts
```

The page must use catalog wrappers, existing API abstractions, contract-defined routes, and contract-defined translations. Do not use raw MUI controls or raw HTML form controls in generated screens.

Run:

```powershell
npm run feature:validate -- <FUNCTION_KEY>
npm run component-map:validate -- <FUNCTION_KEY>
npm run ui:guard
npm run ui:harness -- <FUNCTION_KEY>
```

### 2.4 Review the UI

Select **UI Reviewer**.

Paste:

```text
Story ID=<FUNCTION_KEY>
Review the implementation against ui-contract.json, component-map.json, acceptance.md, and the changed top-ui files.
Write only specs/<FUNCTION_KEY>/review.md. Do not change src/ and do not reread Confluence.
```

Required gate: `review.md` is `PASS`, or every warning is explicitly accepted and no failure remains.

## 3. API branch: `top-api-spec-workflow`

Open `top-api-spec-workflow` in VS Code. The API agents write the contract beside the shared feature artifacts and write Java only in the selected Java application repository.

### 3.1 Start the API orchestrator

Select **API Spec Orchestrator**.

Paste:

```text
Function Key=<FUNCTION_KEY>
Confirm that top-spec-workflow/specs/<FUNCTION_KEY>/grill.json is agreed.
Drive the API workflow through contract, Java implementation, tests, and review.
Stop at every unmet gate and name the missing artifact.
```

### 3.2 Create the API contract

Select **API Contract Analyst**.

Paste:

```text
Function Key=<FUNCTION_KEY>
grill.json is agreed. Create or update top-spec-workflow/specs/<FUNCTION_KEY>/api-contract.json from requirements.md, design.md, acceptance.md, decisions.md, and source references.
Do not generate Java. Do not invent entities, tables, relationships, permissions, validation, endpoints, or error behavior.
Validate against schemas/api-contract.schema.json.
```

The durable contract is:

```text
top-spec-workflow/specs/<FUNCTION_KEY>/api-contract.json
```

The API README currently lists validation/generation commands as planned rather than providing a package script. Until those scripts exist, validate against `top-api-spec-workflow/schemas/api-contract.schema.json` and complete the analyst's source-reference review.

### 3.3 Implement Java

Resolve the real service module and base package from the Java repository build files. Do not generate into the demo module by default.

Select **Java Function Developer**.

Paste:

```text
Function Key=<FUNCTION_KEY>
api-contract.json is schema-valid. Resolve the target service module and base package from the Java repository, then implement only the API contract.
Reuse the framework's generic controller, service, authorization, pagination, error, and OpenAPI infrastructure.
Do not add feature controllers, CRUD services, security filters, mappers, or undocumented behavior.
```

Feature-specific Java code belongs under the selected service module's Function Key package. Shared entities belong under the base package's shared `entity/` directory and must be reused if already present.

### 3.4 Generate and run API tests

Select **Java Test Engineer**.

Paste:

```text
Function Key=<FUNCTION_KEY>
Use acceptance.md and api-contract.json to create or update Cucumber scenarios under the selected service module's src/test/resources/features/.
Cover success, validation, and business-rejection scenarios, then run the service build and test commands.
Document failures without inventing expected behavior.
```

### 3.5 Review Java

Select **Java Function Reviewer**.

Paste:

```text
Function Key=<FUNCTION_KEY>
Review the generated Java implementation and Cucumber feature against api-contract.json, acceptance.md, and the framework rules.
Check silent failures, framework-owned layers, Jackson 3 imports, error codes, entity reuse, and endpoint behavior.
Write review.md only and report PASS, WARNING, or FAIL.
```

Required API gates:

```text
api-contract.json = schema-valid
Java build/tests = pass
Java governance checks = pass
review.md = PASS, or warnings explicitly accepted
```

## 4. Final merge gate

The feature is complete only when all branches refer to the same Function Key:

```text
Shared: grill.json.status = agreed
Shared: requirements.md, design.md, tasks.md, acceptance.md are reviewable
UI:     ui-contract.json valid
UI:     component-map.json valid
UI:     ui:guard and ui:harness pass
UI:     review.md passes
API:    api-contract.json schema-valid
API:    Java tests and governance pass
API:    review.md passes
```

The UI and API branches can proceed in parallel after the shared grill and shared artifacts are agreed. Neither branch may bypass that agreement gate.
