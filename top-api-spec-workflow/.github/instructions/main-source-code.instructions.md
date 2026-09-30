---
applyTo: "**/src/main/java/**/*.java"
description: Rules for framework-consuming main source code in TOP microservices.
---

# Main source code rules

These rules apply in addition to `.github/copilot-instructions.md` and the Java implementation reference.

## Hard rules

- Do not add `@RestController`, CRUD `@Service`, `@RestControllerAdvice`, OpenAPI annotations,
  pagination code, security filters, or routing code. `top-common` owns these concerns.
- Do not add custom methods to repository interfaces. Use `JpaSpecificationExecutor`, a named query, a
  named native query, or a SQL chain.
- Use Jackson 3 (`tools.jackson.*`) only. Never import `com.fasterxml.jackson.*`.
- Use `com.top.framework.<layer>.<Type>` imports and inspect the selected service module when an exact
  type name is uncertain.
- Use constructor injection and `final` fields. Do not use field `@Autowired`.
- Register each `functionId` and action exactly once, using one registration path.

## Models and validation

- Filter DTOs extend `GenericFilter` and contain only searchable fields.
- Data DTOs extend `GenericDataStore`.
- Entities implement `BaseModel`; entities reachable by `PUT /{id}` implement `IdentifiableModel`.
- Extend `AuditableEntity` when the table uses standard audit columns. For non-standard audit columns,
  use the repository's established auditing configuration with explicit auditing annotations and entity
  listeners.
- Use `@ExcludeFromParameterMap` for fields that must not be sent to SQL parameters.
- Validation messages are error codes, never prose. Add a matching error-catalogue entry in the same
  application change.
- Status-like values use `String` plus constants, not Java enums.
- Use `@ExistsInDb` for confirmed foreign-key rules and `@BusinessConstraint` for confirmed cross-field
  rules; do not replace source-backed rules with processor guesses.

## Named queries and SQL

- Declare JPQL queries with `@NamedQuery` and native queries with `@NamedNativeQuery` on the entity.
- Name queries `{ENT}.{purpose}`, such as `INV.lockRow` or `INV.deductStock`.
- Read named queries return a `GenericDataStore` subtype.
- `countSql` is native SQL and must accept the same parameters as the data query.
- Bind request values as named parameters. Never concatenate request values into SQL.
- `:userId` and `:tenantId` come from `CRMContext`; do not add them to the model.
- Verify every named parameter against `buildParameterMap()` or a previous chain result. A typo on a
  write parameter can be silently swallowed.

## Filters and concurrency

- Null filter fields are omitted from the parameter map. Do not use
  `WHERE (:code IS NULL OR code = :code)` unless the parameter is explicitly bound.
- Use only supported query modes: `JPA`, `NATIVE_SQL_OR_JQL`, `COMBO`, or `CUSTOM`.
- For concurrency-sensitive numeric updates, use a transactional chain: JPQL
  `SELECT_FOR_UPDATE` followed by a native guarded update.
- Put the concurrency guard in the SQL `WHERE` clause, not only in a Java pre-check.
- Native updates bypass `@Version` and JPA auditing. Set audit columns in SQL and include a version
  predicate when optimistic locking is required.
- Mark non-mutating actions read-only when appropriate, except when the read must observe a write in the
  same request or must serialize a lazy association.

## Processors and events

- Use `@Component("{entity}Processor")` and implement `CustomLogicProcessor` only when business rules
  require it.
- Use the `(payload, CRMContext)` hook overload where available. Valid hooks are `preSearch`, `postSearch`,
  `preCreate`, `postCreate`, `preUpdate`, `postUpdate`, `preDelete`, and `postDelete`; `preValidate` is
  not invoked.
- Reject through `ErrorReporter`, never a bare `IllegalArgumentException`.
- Accumulate independent validation failures when appropriate, then reject once so clients receive all
  relevant field errors.
- Split processors that grow beyond one responsibility into focused collaborators rather than adding
  unrelated mapping, lifecycle, sequence, screen-loading, or notification logic to one class.
- Events published inside a transaction require `@TransactionalEventListener(phase = AFTER_COMMIT)` for
  side effects. Confirm the event payload type before casting; it may be an entity, row count, or id.

## Logging and documentation

- Use parameterized logging and never log whole DTOs/entities, tokens, passwords, or personal data.
- Log identifiers rather than object contents. Handled business rejections should not be logged at
  `ERROR`; when logging exceptions, preserve the exception as the final argument.
- Add Javadoc to registration methods describing the endpoint, chain steps, and SQL parameter sources.
