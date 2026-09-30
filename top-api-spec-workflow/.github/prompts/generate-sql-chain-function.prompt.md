---
agent: agent
description: Generate a concurrency-safe SQL-chain function (pessimistic lock + native update) from a validated API contract.
---

# Generate a SQL-chain function

Generate a function whose write must be safe under concurrent access — stock deduction, balance
adjustment, quota consumption, gapless sequence allocation.

Requires a validated **API contract** whose concurrency behavior, guard, and transaction requirements
are source-supported. Chat-only preparation notes are not sufficient implementation input. If the contract
is missing or does not resolve those requirements, stop and record the gap in `openQuestions`. For plain
CRUD, use `/generate-crud-function`.

Run this prompt from the Java application repository. Write Java, test, and error-catalogue changes only
there; never create application source files under `top-api-spec-workflow` or `top-spec-workflow`.

## Target service module

Resolve the target service module from the API contract and repository build files before generating. The
repository may contain `top-cmn`, `top-crm`, `top-smb`, or other services.

Use:

- `{SERVICE_MODULE}` — the actual Maven/Gradle service module;
- `{BASE_PACKAGE}` — that service's existing Java package root;
- `{FUNCTION_PACKAGE}` — `{BASE_PACKAGE}.{function-key}` using the local package convention.

`{BASE_PACKAGE}/entity/` is shared across every function key in the service module; it is not nested
under `{FUNCTION_PACKAGE}`. Before generating `{Entity}.java`, check whether it already exists there for
the same table and reuse it instead of creating a duplicate.

Inspect the root build file, the service module build file, and one existing feature. Do not assume
`top-demo-project` or `com.top.demo`. If the module or package root is ambiguous, stop and ask before
writing files.

Reference implementations to follow exactly:
`top-demo-project/src/main/java/com/top/demo/inventory/` — `INV-002` (two-step) and `INV-003`
(three-step).

## The two constraints that dictate the design

Both come from `NamedQueryExecutor`, and neither is visible from the configuration API:

1. **`SELECT_FOR_UPDATE` works only with a named JPQL query** (`@NamedQuery`). The executor calls
   `createNamedQuery` with no native fallback, and JPA forbids `setLockMode` on a native query — a named
   *native* query fails at runtime.
2. **A native `UPDATE` bypasses `@Version` and bypasses JPA auditing.**

Therefore: **lock with JPQL, mutate with native SQL, set the audit column in the SQL.** This is not a
style preference.

## Chain shape

```
Step 1  SELECT_FOR_UPDATE   @NamedQuery  (JPQL)     → pessimistic row lock, held until commit
Step 2  UPDATE              @NamedNativeQuery       → the mutation, with the guard in the WHERE clause
        .transactional(true)                        → without this the lock releases before step 2
```

For create-then-post-process, prepend a JPA step (`INV-003`):

```
Step 1  JPA save            → the persisted entity becomes previousResult
Step 2  SELECT_FOR_UPDATE   → parameters extracted from previousResult automatically
Step 3  UPDATE (native)     → the mutation
```

## Generate

| # | File | Notes |
|---|------|-------|
| 1 | `{Entity}.java` | `{SERVICE_MODULE}/src/main/java/{BASE_PACKAGE}/entity/`; use `@NamedQueries` (the JPQL lock) and `@NamedNativeQueries` (the DML) |
| 2 | `{Entity}DataDto.java` | `{SERVICE_MODULE}/src/main/java/{FUNCTION_PACKAGE}/dto/`, or reuse the entity as `dataClass` |
| 3 | `{Entity}FilterDto.java` | `{SERVICE_MODULE}/src/main/java/{FUNCTION_PACKAGE}/dto/` |
| 4 | `{Entity}Repository.java` | `{SERVICE_MODULE}/src/main/java/{FUNCTION_PACKAGE}/repository/` |
| 5 | `{Entity}FunctionConfig.java` | `{SERVICE_MODULE}/src/main/java/{FUNCTION_PACKAGE}/config/`; `@PostConstruct` builder — the **only** path that supports `SqlWriteType`, `transactional` and chains |
| 6 | `{Entity}Processor.java` | `{SERVICE_MODULE}/src/main/java/{FUNCTION_PACKAGE}/processor/`; pre-write guards; reject via `ErrorReporter` |
| 7 | Error catalogue entries | |
| 8 | `{module}-{entity}.feature` | Including the guard-blocked scenario |

## Named query rules

```java
@NamedQueries({
    @NamedQuery(
        name  = "{ENT}.lockRow",
        query = "SELECT e FROM {Entity} e WHERE e.keyA = :keyA AND e.keyB = :keyB")
})
@NamedNativeQueries({
    @NamedNativeQuery(
        name  = "{ENT}.{mutation}",
        query = "UPDATE tb_{table} " +
                "   SET {field} = {field} - :amount, upd_by = :userId " +
                " WHERE key_a = :keyA AND key_b = :keyB " +
                "   AND {field} >= :amount")            // ← the guard
})
```

- Naming: `{ENT}.{purpose}`.
- **Put the business guard in the `WHERE` clause**, never as a Java `if` before the update. In SQL the
  check and the write are one atomic statement, so no window exists between them. A Java check
  reintroduces exactly the race the lock was meant to close.
- Always set the audit column (`upd_by = :userId`) — `:userId` is injected from `CRMContext`
  automatically, so it does not go on the model.
- Every `:param` must exist in `buildParameterMap()`, come from the previous step, or be `:userId` /
  `:tenantId`. **A parameter-name typo on a write is silently swallowed** and the statement runs
  unbound — verify each one by hand.
- The request payload wins over previous-step values because chain parameter assembly uses `putIfAbsent`.
- If a chain starts with a JPA insert and a later native step must see it, use `saveAndFlush` or an
  explicit insert; do not assume an automatic flush between steps.

## Parameter flow

Each native step assembles parameters in this order, later sources using `putIfAbsent`:

```
1. data.buildParameterMap()             the request payload — wins
2. previous step's result               a BaseModel, or a single-element List of one
3. :userId, :tenantId                   from CRMContext
```

A multi-row previous result contributes nothing. State in the generated Javadoc where each parameter
comes from — that is what makes a chain reviewable.

## Optimistic locking, if the spec asks for it

A native `UPDATE` ignores `@Version`, so carry the version in the SQL:

```sql
UPDATE tb_{table}
   SET {field} = :value, version = version + 1, upd_by = :userId
 WHERE {pk} = :{pk} AND version = :version
```

Zero rows affected means someone else changed the row. Detect it in `postUpdate` and reject with the
spec's code — the framework has no handler for optimistic-lock failures, so an unhandled conflict
returns HTTP 500.

## Output format

Full compilable files, each with its path. Then:

**Chain diagram** — the steps, their modes, write types, named queries, and the parameter source of each
step.

**Guard behaviour** — state plainly what happens when the guard blocks. Default framework behaviour is
zero rows affected and HTTP 200 with the data unchanged. If the spec wants a 4xx, implement the row-count
check in `postUpdate` and say so.

**Spec coverage** — every field and rule mapped to its implementation.

**Assumptions and gaps.**

**Test note** — state explicitly that the Cucumber suite runs on H2, which does not reproduce PostgreSQL
row locking, so the generated scenarios prove the chain executes and the data is correct but **not**
that concurrent callers serialise. Recommend a Testcontainers-backed concurrent test for the locking
behaviour itself.

## Do not

- Do not use `QueryMode.MIXED` — a mixed chain is a list of steps of different modes.
- Do not use `LOCK_WITH_VERSION` or `LOCK_WITHOUT_VERSION`; they are not implemented.
- Do not put `SELECT_FOR_UPDATE` on a native query.
- Do not omit `.transactional(true)`.
- Do not implement the guard as a Java pre-check instead of a SQL predicate.
- Do not rely on JPA auditing for a native update.
- Do not assume a native step sees a preceding JPA step's pending insert — there is no automatic flush
  between chain steps. If it must, note it and use `saveAndFlush` in the processor or an explicit
  `INSERT` step.
