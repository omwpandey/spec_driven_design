---
agent: agent
description: Generate a complete standard CRUD function from a validated API contract.
---

# Generate a CRUD function

Generate all framework files only from an attached, validated **API contract**. Chat-only preparation notes
are not sufficient implementation input. If no API contract is attached, first complete the shared feature
agreement, create/update `api-contract.json`, and validate it against `schemas/api-contract.schema.json` —
do not generate from a raw DR document or preparation notes alone.

Run this prompt from the Java application repository. Write Java, test, and error-catalogue changes only
there; never create application source files under `top-api-spec-workflow` or `top-spec-workflow`.

## Target service module

Before generating, identify the target service module from the API contract and the Java repository build
files. The repository may contain several services such as `top-cmn`, `top-crm`, and `top-smb`.

Use these resolved values in every generated path and package declaration:

- `{SERVICE_MODULE}` — the actual Maven/Gradle service module, for example `top-crm`;
- `{BASE_PACKAGE}` — the existing Java package root for that service, for example `com.top.crm`;
- `{FUNCTION_PACKAGE}` — `{BASE_PACKAGE}.{function-key}` using the repository's package naming convention.

`{BASE_PACKAGE}/entity/` is shared across every function key in the service module; it is not nested
under `{FUNCTION_PACKAGE}`. Before generating `{Entity}.java`, check whether it already exists there for
the same table and reuse it instead of creating a duplicate.

Do not assume `top-demo-project`, `com.top.demo`, or a module from the example. Inspect the root build file,
the service module build file, and one existing feature. If the target module or package root is ambiguous,
stop and ask for it before generating files.

For a function with a concurrency-sensitive write, use `/generate-sql-chain-function` instead.

## Generate

| # | File | Path |
|---|------|------|
| 1 | `{Entity}.java` | `{SERVICE_MODULE}/src/main/java/{BASE_PACKAGE}/entity/` |
| 2 | `{Entity}DataDto.java` | `{SERVICE_MODULE}/src/main/java/{FUNCTION_PACKAGE}/dto/` |
| 3 | `{Entity}FilterDto.java` | `{SERVICE_MODULE}/src/main/java/{FUNCTION_PACKAGE}/dto/` |
| 4 | `{Entity}Repository.java` | `{SERVICE_MODULE}/src/main/java/{FUNCTION_PACKAGE}/repository/` |
| 5 | `{Entity}CrudConfig.java` | `{SERVICE_MODULE}/src/main/java/{FUNCTION_PACKAGE}/config/` |
| 6 | `{Entity}Processor.java` | `{SERVICE_MODULE}/src/main/java/{FUNCTION_PACKAGE}/processor/` — **only if the contract lists business rules** |
| 7 | `crm_error_messages.json` entries | the existing error-catalogue path in `{SERVICE_MODULE}` |
| 8 | `{module}-{entity}.feature` | `{SERVICE_MODULE}/src/test/resources/features/` |

Never generate: a controller, a CRUD service, an exception handler, OpenAPI annotations, pagination
code, a security filter, a DTO mapper, or a repository query method.

## Rules

Follow the Java application's `.github/copilot-instructions.md` and the API workflow's
`.github/instructions/java-implementation-reference.instructions.md`. The
points most often got wrong:

1. Imports are `com.top.framework.<layer>.<Type>`. Jackson is `tools.jackson.*`.
2. Filter DTO contains **only** fields marked searchable.
3. Every validation `message` is the spec's error code, never prose.
4. Use `ValidationGroups.OnCreate` / `OnUpdate` / `OnSave` when the spec says a field is required at
   different times.
5. Entity extends `AuditableEntity` unless the spec's audit columns differ.
6. Entity implements `IdentifiableModel` so `PUT /{id}` binds the path id.
7. Add `@ExistsInDb(table = "...", column = "...", message = "ERR_...")` for every FK field.
8. `readOnlyQueries = true` unless the spec says otherwise.
9. Status fields are `String` plus a constants class, not a Java `enum`.
10. In the processor, reject through `ErrorReporter.fail(code, field)` — never a bare
    `IllegalArgumentException`, which becomes HTTP 500 instead of 400.
11. Generate a `@Component("{entity}Processor")` bean name matching `processorBeanName` in the config.

## Registration path

Use `@GenericCrud` when every action is plain JPA CRUD.

Use `FunctionConfig.builder()` with `@PostConstruct` when the spec needs any of: a named query, a
`countSql`, `transactional`, an explicit `readOnly` per action, a `SqlWriteType`, validation groups, or
more than one query step. Say which you chose and why in one line.

## Output format

For each file: the full path, then a complete compilable file in a code block. No fragments, no
`// ... rest unchanged`.

Then:

**Endpoints created**

```
GET    /v1/{FN}/search?filter={"filter":{…},"page":0,"size":20}
GET    /v1/{FN}/get/{id}
POST   /v1/{FN}/create              {"data":{…}}
POST   /v1/{FN}/create/bulk         {"tableData":[{…}]}
PUT    /v1/{FN}/update/bulk         [{"data":{…}}, {"data":{…}}]
DELETE /v1/{FN}/delete/{id}
```

Search `page`, `size`, and `sortFields` belong inside the search envelope. Do not add controller or
routing code.

**Spec coverage** — a table mapping every field and every business rule to where it is implemented, so
a reviewer can confirm nothing was dropped:

| Spec item | Implemented in |
|-----------|----------------|
| `name` — not blank, max 100, `ERR_PRD_002` | `ProductDataDto.name` |
| Rule 1 — status defaults to DRAFT | `ProductProcessor.preCreate` |

**Assumptions and gaps** — anything the spec did not cover that you had to decide, and anything you
deliberately did not implement. Be explicit; a silent assumption is the main failure mode of generated
code.

## Do not

- Do not guess a business rule the spec omits. List it as a gap.
- Do not invent an error message. Use the code and flag the missing catalogue entry.
- Do not add fields the spec does not list.
- Do not write `WHERE (:x IS NULL OR col = :x)` — null filter fields are omitted from the parameter map,
  so `:x` would be unbound.
- Do not use `QueryMode.STORED_PROCEDURE`, `MIXED`, `LOCK_WITH_VERSION` or `LOCK_WITHOUT_VERSION`. They
  are not implemented and fail silently with an empty HTTP 200.
