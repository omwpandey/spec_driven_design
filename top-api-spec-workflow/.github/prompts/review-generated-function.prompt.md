---
agent: agent
description: Review generated or hand-written framework code against a validated API contract and the framework's silent-failure traps.
---

# Review a function against the spec

Review the attached code against its validated API contract. Report findings; do not rewrite unless asked.

Most defects in this framework **compile and start cleanly**, then misbehave at runtime — an empty HTTP
200, a silently dropped SQL parameter, an authorisation check that never runs. Static review is
therefore worth more here than in most codebases.

## 1. Spec coverage

Build a table and be explicit about gaps:

| Spec item | Implemented in | Status |
|-----------|----------------|--------|
| field / rule / error code | class + member | ✅ / ⚠️ partial / ❌ missing |

Then list: spec items with no implementation, implementation with no spec item, and error codes used but
absent from `crm_error_messages.json`.

## 2. Silent-failure checklist

Each of these produces working-looking code that misbehaves at runtime.

| # | Check | Symptom if wrong |
|---|-------|-----------------|
| 1 | Query mode is `JPA`, `NATIVE_SQL_OR_JQL`, `COMBO` or `CUSTOM` only | `STORED_PROCEDURE`/`MIXED`/`LOCK_*` → empty HTTP 200, no error |
| 2 | Every `:param` in every named query exists in `buildParameterMap()`, comes from the previous step, or is `:userId`/`:tenantId` | A typo on a write is swallowed; the statement runs unbound |
| 3 | No `WHERE (:x IS NULL OR col = :x)` | Null filter fields are omitted, so `:x` is unbound → runtime failure |
| 4 | `SELECT_FOR_UPDATE` points at a **JPQL** `@NamedQuery`, not a native one | Fails at runtime; JPA forbids `setLockMode` on a native query |
| 5 | Multi-step chain has `.transactional(true)` | The lock releases before the mutating step — the race is still open |
| 6 | A concurrency guard is in the SQL `WHERE`, not a Java pre-check | A Java check reintroduces the race the lock was meant to close |
| 7 | Native `UPDATE` sets `upd_by = :userId` | JPA auditing does not see native SQL; audit data silently wrong |
| 8 | Native `UPDATE` on a `@Version` entity carries a version predicate | Optimistic locking silently bypassed |
| 9 | Read named query returns a `GenericDataStore` subclass | Runtime cast failure |
| 10 | `countSql` is valid **native** SQL and accepts the same parameters as the data query | Pagination fails, or `totalCount` is `-1` |
| 11 | The `functionId` + `action` pair is registered exactly once, by one path | Silent overwrite; YAML wins over annotations |
| 12 | Business rejections throw via `ErrorReporter`, not `IllegalArgumentException` | HTTP 500 instead of 400 |
| 13 | Entity implements `IdentifiableModel` if reachable by `PUT /{id}` | The path id is never bound; updates hit the wrong row or insert |
| 14 | Event listeners use `@TransactionalEventListener(AFTER_COMMIT)` | Side effects fire for rolled-back work |
| 15 | Exact-match code fields are not left to `JPA` mode | `String` filters become `LIKE '%value%'` — wrong results, no index |
| 16 | `readOnly` reads do not serialise a lazy association | `LazyInitializationException` (`open-in-view` is `false`) |
| 17 | `preSearch`/`postSearch` hooks are idempotent | They currently fire **N+1** times per request |
| 18 | A page-size cap is applied in `preSearch` | No framework ceiling; `size=1000000` is accepted |

## 3. Framework misuse

- Any `@RestController`, CRUD `@Service`, `@RestControllerAdvice`, OpenAPI annotation, security filter,
  pagination code, DTO mapper class, or custom repository query method — all duplicate the framework.
- Wrong imports: `com.fasterxml.jackson` instead of `tools.jackson`; a reversed framework package such
  as `model.com.top.framework.GenericFilter` instead of `com.top.framework.model.GenericFilter`.
- Field `@Autowired` instead of constructor injection.
- `CustomLogicProcessor.preValidate` used — it is never invoked.
- A Java `enum` for a status field arriving as JSON.
- Non-searchable fields in the filter DTO, or business fields missing from it.
- Validation `message` containing prose instead of an error code.
- A `@GenericCrud` function that needs `transactional`, `readOnly`, a `SqlWriteType`, validation groups
  or a chain — none of which the annotation can express.

## 4. Security and data protection

- `authRoles` present and matching the spec; an empty set means the function is open.
- Row-level rules (own tenant, own dealer, own records) implemented in `preSearch`/`preUpdate` — the
  role check is function-level only and cannot express them.
- No logging of a DTO or entity whole (`toString()` leaks every field, including PII).
- No token, password or personal data in any log line, at any level.
- No request value concatenated into SQL.
- `delete` not exposed where the spec wanted a soft delete — `delete` is a hard delete and
  `SoftDeletable` is not consulted by the framework.

## 5. Tests

- A scenario for every action, every validation rule with its code, every business rule, and every role
  denial.
- Writes verified by **re-reading the data**, not only by asserting the status.
- Scenarios seed their own data and do not depend on order.
- Error **codes** asserted, not message text.
- Concurrency scenarios present where the spec is concurrency-sensitive — with a note that H2 does not
  reproduce PostgreSQL row locking.
- Business rules in the processor covered by unit tests, not only end to end.

## Output

**Verdict** — one of: ready to merge / merge after fixing the P1 items / needs rework. One sentence of
reasoning.

**Findings**, each as:

```
[P0|P1|P2] {file}:{member} — {what}
Why it matters: {the runtime consequence, concretely}
Fix: {the change, with a code snippet where it is not obvious}
```

Severity: **P0** silent data corruption, authorisation bypass, or a spec rule not implemented.
**P1** wrong runtime behaviour, or a missing test for a spec rule. **P2** style, performance, or
maintainability.

**Spec coverage table** (§1).

**Unverifiable** — anything needing a running application or database to confirm, with the test that
would settle it. Do not present an inference as a confirmed defect.
