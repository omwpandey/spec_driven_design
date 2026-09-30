---
applyTo: "**/JAVA_WORKFLOW.md,**/*.md"
description: Reference rules for Java implementation planning from the TOP Spring Boot starter.
---

# Java implementation reference

The Java starter is metadata-driven. Feature modules provide entities, DTOs, repositories, function
registration, and processors while `top-common` provides routing and generic CRUD.

## Framework facts

- Java 21 and Spring Boot 4.1.1.
- PostgreSQL is the production database; H2 runs tests in PostgreSQL mode.
- Jackson 3 is required: use `tools.jackson.*`, never `com.fasterxml.jackson.*`.
- `GenericController` exposes `/v1/{functionId}/{action}`; do not add routing code.

Use framework types from these packages:

```text
com.top.framework.model.*
com.top.framework.annotation.*
com.top.framework.processor.*
com.top.framework.registry.*
com.top.framework.validation.*
com.top.framework.exception.*
```

Common types include `BaseModel`, `AuditableEntity`, `IdentifiableModel`, `GenericDataStore`,
`GenericFilter`, `FunctionConfig`, `QueryDefinition`, `QueryMode`, `SqlWriteType`, `CRMContext`,
`GenericCrud`, `CustomLogicProcessor`, `FunctionRegistry`, `ValidationGroups`, and `ErrorReporter`.

Use this target layout in the selected Java service module. A Java repository may contain multiple service
modules such as `top-cmn`, `top-crm`, and `top-smb`; resolve the target module before planning files.
`entity/` sits at the base-package level, shared across function keys in the module — do not nest it
under `<function-key>`:

```text
<service-module>/src/main/java/<base-package>/
├── entity/
└── <function-key>/
    ├── config/
    ├── dto/
    ├── repository/
    ├── processor/
    └── support/
```

The service module and base package must come from the repository build files and an existing feature. Do
not assume `top-demo-project` or `com.top.demo`. Before generating an entity, check `<base-package>/entity/`
for an existing class for the same table and reuse it instead of creating a duplicate.

Detailed rules for files under `src/main/java` are in
`.github/instructions/main-source-code.instructions.md`. Those rules are automatically applied to Java
source files and cover processor hooks, audit exceptions, SQL parameter safety, events, logging, and
registration Javadoc.

## Required feature pieces

Generate only the pieces required by the validated API contract:

- Entity: `@Entity`, `BaseModel`, and `IdentifiableModel`; extend `AuditableEntity` unless the contract
	documents different audit columns.
- Data DTO: `GenericDataStore`.
- Filter DTO: `GenericFilter` containing only searchable fields.
- Repository: `JpaRepository` and `JpaSpecificationExecutor`, with no custom query methods.
- Registration: `@GenericCrud` for plain JPA CRUD, otherwise `FunctionConfig.builder()`.
- Processor: `CustomLogicProcessor` only when business rules require it.

Validation messages are error-code identifiers, never prose. Use `ValidationGroups` when requirements
differ between create, update, and save. Foreign keys use `@ExistsInDb` only when the contract confirms
the table and column. Status values use `String` plus constants rather than a Java enum.

## Generated routes

For `functionId = PRD-001`, the framework provides:

```text
GET    /v1/PRD-001/search?filter=<url-encoded-json>
GET    /v1/PRD-001/get/{id}
POST   /v1/PRD-001/create
POST   /v1/PRD-001/create/bulk
PUT    /v1/PRD-001/update/{id}
PUT    /v1/PRD-001/update/bulk
DELETE /v1/PRD-001/delete/{id}
```

Search paging and sorting belong inside the search envelope. No feature controller or routing class is
needed.

## Registration rules

- Use `@GenericCrud` only for plain JPA CRUD.
- Use `FunctionConfig.builder()` for named queries, `countSql`, `readOnly`, `transactional`,
	`SqlWriteType`, validation groups, or multi-step chains.
- Register each `functionId` and action exactly once.

## Runtime safety rules

- Null filter values are omitted from the parameter map; do not write `WHERE (:x IS NULL OR col = :x)`.
- `SELECT_FOR_UPDATE` requires a named JPQL query, not a native query.
- Native updates bypass `@Version` and JPA auditing; set audit columns in SQL and include a version
	predicate when optimistic locking is required.
- `countSql` is native SQL and must accept the same parameters as the data query.
- Named read queries must return a `GenericDataStore` subtype.
- Use only supported query modes: `JPA`, `NATIVE_SQL_OR_JQL`, `COMBO`, or `CUSTOM`.
- JPA string filters are case-insensitive `LIKE`; use a named query for exact code matching.
- Delete is hard delete. Use an update action for source-backed soft-delete behavior.
- Named-query parameters must be present in `buildParameterMap()`, a previous chain result, or the
	framework-injected `userId`/`tenantId` values.
- Event listeners for transactional side effects use `AFTER_COMMIT`.

Never plan a feature `@RestController`, CRUD `@Service`, `@RestControllerAdvice`, security filter, manual OpenAPI annotation, pagination implementation, DTO mapper, or custom repository query method when the framework already owns that behavior.

## Code and test standards

- Use constructor injection and `final` fields; do not use field injection.
- Never log a whole DTO or entity; log identifiers and avoid PII.
- Use Cucumber generic steps where possible and custom steps only when database seeding or inspection is
	unavoidable.
- Test every action, validation rule, business rule, and role denial. Assert error codes and verify writes
	by re-reading persisted data.
- H2 does not reproduce PostgreSQL row-lock contention; use a PostgreSQL-backed concurrency test when
	locking behavior itself must be verified.
- Cover custom processors, validators, and helpers with unit tests.
