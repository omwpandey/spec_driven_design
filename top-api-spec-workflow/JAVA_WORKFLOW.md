# Java Workflow

Owned end-to-end by the **API Spec Orchestrator** agent, which hands off to the phase owner below and
stops at any unmet gate.

## Phase 1: Shared requirement agreement

Work in `top-spec-workflow` first:

1. Fetch the DR and preserve the raw source.
2. Review and agree `grill.json` once. Validation rules are `identified.validations` on that file.
3. Write `ui-contract.json` and `api-contract.json` from that grill. Acceptance criteria live on the contracts.
4. Resolve or explicitly record open questions.

## Phase 2: API contract

**Owner:** API Contract Analyst agent.

Create `specs/<FUNCTION_KEY>/api-contract.json` in `top-spec-workflow` using [api-contract.schema.json](schemas/api-contract.schema.json).

Also create `specs/<FUNCTION_KEY>/contract-map.json` using [contract-map.schema.json](schemas/contract-map.schema.json). This map links a UI field or action id to an API id. The UI track copies `method`, `path`, and `responseExample` into `ui-contract.json` `screen.api` from that map and does not invent them.

Each identified API needs `id`, `method`, `path`, `requestExample`, `responseExample`, and the shared validation errors. The API contract must have source references for entities, fields, actions, permissions, errors, and acceptance criteria. Do not infer undocumented table names, relationships, permissions, or validation rules.

## Phase 3: Java implementation

**Owner:** Java Function Developer agent.

Use the starter's reference application as a framework guide, but implement the feature in the selected
service module. A microservice repository may contain `top-cmn`, `top-crm`, `top-smb`, or other services.
Resolve the module from the build files and use the existing package convention. `entity/` lives at the
base-package level, shared across function keys in the service module; do not create a per-function
copy:

```text
<service-module>/src/main/java/<base-package>/
├── entity/                # shared JPA entities, one class per table across all functions
├── repository/            # shared when the service keeps repositories here
└── <function-key>/
    ├── config/
    ├── model/ or dto/       # follow the service convention
    ├── repository/          # only if function-local repositories are used
    ├── processor/
    └── constant/ or support/ # as required
```

Before generating an entity, check whether it already exists at `<base-package>/entity/` from another
function and reuse it instead of duplicating the class. Check the service's shared repositories too.
Choose plain CRUD, composite named-query `FunctionConfig`, or concurrency-sensitive SQL chain based on
the contract and the selected framework runtime, not on a fixed per-function file list.

The reference path `top-spring-boot-starter/top-demo-project/src/main/java/com/top/demo/<function-key>/`
is illustrative only. Do not write feature code to `top-demo-project` unless it is the selected service.

Implement only what the API contract requires. Reuse `top-common` for routing, CRUD, pagination, authorization, error handling, and OpenAPI generation.

### Observed CRM example: WCRM010301

The checked-in `top-crm` implementation is an example of the **resulting file layout**, not evidence
of which files were generated automatically. It has no `api-contract.json` in the shared feature
folder yet, so it cannot itself serve as an approved generation input.

| Ownership | Observed files and purpose |
|---|---|
| `com.top.crm.wcrm010301.config` | `TmtActivityMasterFunctionConfig` registers GET `search` and POST `save` using `FunctionConfig.builder()` and named queries. |
| `com.top.crm.wcrm010301.model` | `TmtPMActivityMasterDto`, `TmtPMActivityMasterFilterDto`, `TmtRepairInspectionItemDto`, `TmtContactChannelDetailDto`; the parent nests validated child lists. |
| `com.top.crm.wcrm010301.processor` | `TmtActivityMasterProcessor` enriches the search result with children, validates business rules, and dispatches child writes by row status. |
| `com.top.crm.wcrm010301.constant` | `TmtActivityMasterConstants` and `TmtActivityMasterErrorCode`; error messages live in the service's `crm_error_messages.json`. |
| `com.top.crm.entity` | Shared `TbMCrmActivityTmt`, `TbMCrmActivityItemDetailTmt`, and `TbMCrmContactProcessChannelTmt` hold table mappings and named SQL; reuse existing table owners. |
| `com.top.crm.repository` | Shared `TbMCrmActivityTmtRepository` provides child reads; do not create a second repository just to satisfy a template. |
| `src/test` | `features/WCRM010301.feature` and `com.top.crm.test.steps.TmtActivityMasterSteps` exercise framework routes. |

Before mirroring this example, verify the selected service's query executor, processor lifecycle and
transaction boundaries. The sample contains native lock queries and placeholder audit user values;
neither is a generation rule. Resolve lock/version semantics, audit parameters, and child rollback
from the validated contract and the actual runtime.

## Phase 4: Verification

**Owner:** Java Test Engineer agent (generation and test run), then Java Function Reviewer agent (review.md).

Map `api-contract.json` `acceptanceCriteria` to Cucumber features under
`<service-module>/src/test/resources/features/` and add unit tests only for custom processors, validators,
and helpers. Run the selected service's build/test command and Java governance checks before review.

## Review gates

- API contract is schema-valid.
- Every generated item has a source reference or an explicit unresolved question.
- No feature `@RestController` or CRUD `@Service` was added.
- Java uses Jackson 3 imports.
- Error messages use error codes from `crm_error_messages.json`.
- Repository interfaces use framework-approved JPA patterns.
- Generated endpoints match the framework's `GenericController` routes.
