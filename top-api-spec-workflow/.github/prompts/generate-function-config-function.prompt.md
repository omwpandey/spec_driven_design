---
agent: agent
description: Generate a FunctionConfig-backed named-query or composite parent-child Java function from a validated API contract.
---

# Generate a FunctionConfig function

Use a validated `top-spec-workflow/specs/<FUNCTION_KEY>/api-contract.json`. If the contract is missing,
has blocking questions, or does not define child operations and validation behavior needed for a
composite write, stop and return those gaps to the API Contract Analyst. Do not infer behavior from
WCRM010301 or the raw DR. For plain JPA CRUD use `/generate-crud-function`; for a source-backed
concurrency-sensitive write use `/generate-sql-chain-function`.

Write application files only in the selected Java service module. Resolve its build file, base package,
DTO package (`model/` or `dto/`), and existing feature conventions before planning files. The
WCRM010301 example in `top-crm` illustrates a composite `search`/`save`, not a mandatory template.

## Inventory and plan

1. Inventory every contract action, its method and framework path, root entity, child collections,
   row statuses, named reads/writes, validations, error codes, and acceptance criteria. Map the
   contract's API IDs to registration actions; never assume standard `create`/`update` routes when the
   contract specifies `save`.
2. For each table, check `<base-package>/entity/` for an existing mapping and named queries. Reuse
   shared entities and repositories under `<base-package>/repository/` where they already own the
   table. Add only source-backed mappings or queries; do not create duplicate entities, repositories,
   or colliding named query names.
3. Plan a root `GenericDataStore` DTO, `GenericFilter` for documented search fields, and nested
   `GenericDataStore` child DTOs only for documented child collections. Use `@Valid` for child
   validation. Match the service's DTO package convention. Add constants and error-catalogue entries
   only for documented codes; add a `CustomLogicProcessor` only for documented business behavior.

## Register and implement

- Register each `(functionId, action)` exactly once with `FunctionConfig.builder()`; set the
  contract-backed `httpMethod`, `dataClass`, `filterClass`, repository/query metadata, and
  `processorBeanName` when applicable. Check each named query exists on an entity and that its
  result-set mapping constructor, column aliases, and types match the DTO.
- If the contract specifies a composed read, load the root with the registered named query and
  attach children using existing repository reads or named queries in `postSearch`. Check missing
  or duplicate root behavior against the contract; never infer it from the sample processor.
- For a composed write, map contract status values to documented parent and child operations;
  validate all rows before writes where possible. Put child writes in the appropriate processor
  lifecycle hook and verify the selected framework action actually invokes that hook. Confirm that
  parent and child writes share the intended transaction and that failures roll back all changes.
- For each native write, trace every named parameter to `buildParameterMap()`, a prior result,
  or the framework-injected context. Use the authenticated `userId` for audit columns, never
  placeholders. Verify the requested lock mode is supported by the selected service's runtime;
  do not copy native `FOR UPDATE` with `LOCK_WITH_VERSION` from WCRM010301 without checking the
  executor. Native updates bypass JPA versioning and auditing: add source-backed version checks,
  audit assignments, and conflict handling when required by the contract.
- Follow `.github/instructions/java-implementation-reference.instructions.md` and
  `.github/instructions/main-source-code.instructions.md`. Do not generate a controller, CRUD
  service, DTO mapper, security filter, or manual OpenAPI route.

## Verify and report

Generate complete compilable files at their actual service paths, then Cucumber scenarios for each
registered action, validation and child-row status (including rollback on a failed child write).
Add focused tests for processor hooks and result-set mapping where needed. Run the service build and
tests. Report a file inventory (created vs. reused), action-to-route and query map, parameter sources,
transaction/hook evidence, spec coverage and unresolved gaps. Never claim a route or locking guarantee
based only on the WCRM010301 example.